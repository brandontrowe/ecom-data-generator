'use strict';

const fs = require('fs');
const casual = require('casual');
let settings = {
    prodQty: 40,
    catQty: 10,
    colors: [
        'E6E2AF',
        'A7A37E',
        'EFECCA',
        '046380',
        '002F2F',
        '003D3D',
        '005959',
        '057A9E',
        '034357',
        '7D7A5E',
        '454334',
        'A19D79',
        'D1DBBD',
        '91AA9D',
        '3E606F',
        '193441',
        '23495C',
        '326882',
        '8D9480'
    ]
}

const dbPath = './ecomdb.json';
let db = {};
let data = {
    categories: [],
    products: []
};


/* Define CasualJS generators */
casual.define('category', function() {
    let options = {
        title: casual.title,
        color: getColor()
    }
    return {
        id : casual.integer(100000, 999999),
        title: options.title,
        description: casual.description,
        image: {
            banner: 'https://placehold.it/1300x200/' + options.color + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
        },
        productAssignments: assignRandomProducts(data.products)
    };
});

casual.define('product', function() {
    let options = {
        title: casual.title,
        maincolor: getColor(),
        altcolor: getColor()

    }
    return {
        id : casual.integer(100000, 999999),
        title: options.title,
        price: (Math.round(casual.double(0.01, 200) * 100)/100).toFixed(2),
        description: casual.description,
        image: [{
                main: 'https://placehold.it/600x600/' + options.maincolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
                zoom: 'https://placehold.it/1200x1200/' + options.maincolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+')
            },{
                main: 'https://placehold.it/600x600/' + options.altcolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
                zoom: 'https://placehold.it/1200x1200/' + options.altcolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+')
            }
        ]
    };
});

/**
 * Returns a random color from the color setting array
 * @returns color {String}
 */
const getColor = function() {
    return settings.colors[casual.integer(0,(settings.colors.length - 1))]
}

/**
 * Chooses products ids at random and returns them
 * @param products {Array}
 * @returns productIds {Array}
 */
function assignRandomProducts(products) {
    let filteredProds = products.filter( (prod) => Math.round(Math.random()) );
    let prodIdsArr = filteredProds.map( (prod) => prod.id );

    return prodIdsArr;
}

/**
 * Chooses products to assign as upsells
 * @param products {Array}
 * @returns productIds {Array}
*/
function assignUpsellProducts(prodArr) {
    let filteredProds = prodArr.filter( (prod) => Math.round(Math.random()) );
    let prodIdsArr = filteredProds.map( (prod) => prod.id );
    let returnIdsArr = [];
    let i;
    for(let i = 0; i < 3; i++) {
        returnIdsArr.push(prodIdsArr[Math.floor(Math.random()*prodIdsArr.length)]);
    }

    return returnIdsArr;
}

/**
 * Returns randomly generated categories
 * @returns categories {Array}
 */
const getCategories = function() {
    let catArr = [];
    let category = {};
    let i;

    for (i = 0; i < settings.catQty; i++) {
        category = casual.category;
        catArr.push(category);
    }
    return catArr;
}

/**
 * Returns randomly generated products
 * @returns products {Array}
 */
function getProducts() {
    let prodArr = [];
    let product = {};
    let i;

    for (i = 0; i < settings.prodQty; i++) {
        product = casual.product;
        prodArr.push(product);
    }
    for(i = 0; i < prodArr.length; i++) {
        prodArr[i].upsells = assignUpsellProducts(prodArr)
    }

    return prodArr;
}

data.products = getProducts();
data.categories = getCategories();

(function() {
    db = {
        "products" : data.products,
        "categories" : data.categories
    }
    fs.writeFile(dbPath, JSON.stringify(db), 'utf8', function(){
        console.log('Database file created.');
    });
})();
