'use strict';

const fs = require('fs');
const casual = require('casual');
let settings = {
    prodQty: 40,
    catQty: 10
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
        color: casual.rgb_hex.replace('#', '')
    }
    return {
        id : casual.integer(0, 999999),
        title: options.title,
        description: casual.description,
        image: {
            banner: 'https://placehold.it/1000x200' + options.color + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
        },
        productAssignments: assignRandomProducts(data.products)
    };
});

casual.define('product', function() {
    let options = {
        title: casual.title,
        maincolor: casual.rgb_hex.replace('#', ''),
        altcolor: casual.rgb_hex.replace('#', '')

    }
    return {
        id : casual.integer(0, 999999),
        title: options.title,
        price: (Math.round(casual.double(0.01, 200) * 100)/100).toFixed(2),
        description: casual.description,
        image: [{
                main: 'https://placehold.it/600x600' + options.maincolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
                zoom: 'https://placehold.it/1200x1200' + options.maincolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+')
            },{
                main: 'https://placehold.it/600x600' + options.altcolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+'),
                zoom: 'https://placehold.it/1200x1200' + options.altcolor + '?text=' + options.title.replace(new RegExp(' ', 'g'), '+')
            }
        ]
    };
});

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
    return prodArr;
}

/**
 * Chooses products ids at random and returns them
 * @param products {Array}
 * @returns products ids {Array}
 */
function assignRandomProducts(products) {
    let filteredCats = products.filter( (prod) => Math.round(Math.random()) );
    let prodIdsArr = filteredCats.map( (prod) => prod.id );

    return prodIdsArr;
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
