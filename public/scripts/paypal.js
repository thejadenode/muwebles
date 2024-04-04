paypal.Buttons({
  style: {
    layout: 'vertical',
    color:  'gold',
    shape:  'rect',
    label:  'paypal',
    tagline: false,
  },
  createOrder: function(data, actions) {

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: getTotal(),
        },
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      finalizeTransaction('Paypal');
  });
  }
}).render('#paypal-button-container');