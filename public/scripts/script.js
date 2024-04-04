document.addEventListener('DOMContentLoaded', () => {
    $('footer').load('../footer.html')
    $('nav').load('../navbar.html')
})

function addProductCard(product, container) {
    var col = $('<div>', { class: 'col-auto' });
    var product_container = $('<div>', { class: 'product-card-container container' });
    $(product_container).on('click', ()=>{
        localStorage.setItem('activeProductId', product.id);
        window.location.replace('product.html');
    });

    var product_image = $('<img>', { class: 'product-card-image', src: 'images/products/placeholder.svg' });

    var product_details = $('<div>', { class: 'product-card-details row justify-content-center d-flex' });
    var product_name = $('<div>', { class: 'product-card-name text-center fs-5 text-color-primary fw-bold', text: product.name });
    var product_price = $('<div>', { class: 'product-card-price text-center fs-6 fw-normal', text: '₱' + product.price });
    $(product_details).append(product_name);
    $(product_details).append(product_price);

    var product_rating = $('<div>', { class: 'product-card-rating row fs-5 text-center text-color-primary', text: product.rating });
    var product_rating_text = '';
    for (var i=0; i<product.rating; i++){
        product_rating_text += '★';
    }
    for (var i=0; i<5-product.rating; i++){
        product_rating_text += '☆';
    }
    $(product_rating).text(product_rating_text);

    var product_btnContainer = $('<div>', { class: 'product-card-btnContainer container-fluid' });
    var product_cartBtn = $('<button>', { class: 'product-card-addToCart bg-primary fw-bold text-white border-0 fs-6 w-100', text: 'View item' });
    $(product_btnContainer).append(product_cartBtn);

    $(product_container).append(product_image);
    $(product_container).append(product_details);
    $(product_container).append(product_rating);
    $(product_container).append(product_btnContainer);

    $(col).append(product_container);
    $(container).append(col);

    $(product_cartBtn).on('click', () => { addToCart(product.id) })
    firebase.storage().ref('prodImg/' + product.id).getDownloadURL().then((url) => { $(product_image).attr('src', url) });
}

function addProductItem() {

}
