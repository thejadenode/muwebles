document.addEventListener('DOMContentLoaded', function () {
    $('head').append('<script defer src="/__/firebase/9.8.3/firebase-app-compat.js"></script>');
    $('head').append('<script defer src="/__/firebase/9.8.3/firebase-auth-compat.js"></script>');
    $('head').append('<script defer src="/__/firebase/9.8.3/firebase-firestore-compat.js"></script>');
    $('head').append('<script defer src="/__/firebase/9.8.3/firebase-storage-compat.js"></script>');
    $('head').append('<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>');

    const firebaseConfig = {
        apiKey: "AIzaSyBPMdS773g1zh8sc4nK016tvUs1EOC6nyc",
        authDomain: "muweblesph.firebaseapp.com",
        projectId: "muweblesph",
        storageBucket: "muweblesph.appspot.com",
        messagingSenderId: "22712488918",
        appId: "1:22712488918:web:ac5d2006dd462811c50a77",
        measurementId: "G-ZL13ZV1YFG"
      };

    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    var storage = firebase.storage();
    var users = db.collection("users")

    $('#nav-admin').hide();

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            $('#nav-user-signIn').remove();

            users.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().firstName) $('#nav-username').text(doc.data().firstName)
                    localStorage.setItem('isLoggedIn', 'true');
                    $(document).trigger("FirebaseUserLoaded", [user, doc.data()]);
                    console.log(doc.data().isAdmin)
                    if (doc.data().isAdmin == 'true' || doc.data.isAdmin == true) {
                        localStorage.setItem('hasAdminRights', 'true');
                    } else {
                        $('#nav-user-admin').remove();
                    }
                }
            })

        } else {

            $('#nav-user-account').remove();
            $('#nav-user-signOut').remove();
            $('#nav-user-admin').remove();
            $('#nav-user-cart').remove();
            $('#nav-user-divider').remove();
            $('#nav-user-signIn').show();
            $('#nav-user-divider').remove();
            $('#nav-user-orders').remove();
        }
    })
    $(document).trigger("FirebaseInitialized");
})

function setErrorMessage(error) {
    var msg = "";
    switch (error.code) {
        case 'auth/user-not-found': msg = "User not found";
            break;

        case 'auth/invalid-email': msg = "Email is invalid";
            break;

        case 'auth/invalid-credential': msg = "Credentials is invalid";
            break;

        case 'auth/wrong-password': msg = "Current password is incorrect.";
            break;

        case 'auth/weak-password': msg = "Password should be at least 6 characters";
            break;

        case 'auth/email-already-in-use': msg = "Email is already in use";
            break;

        case 'auth/internal-error': msg = "Please complete all fields";
            break;
    }

    $('#error').text(msg);
    console.log("SetErrorMessage: " + error)
}

function register() {
    var email = $('#input-email').val();
    var password = $('#input-password').val();
    var firstName = $('#input-firstName').val();
    var lastName = $('#input-lastName').val();


    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            user.updateProfile({
                displayName: firstName + ' ' + lastName,

            })
            // Set details on Firestore
            firebase.firestore().collection('users').doc(user.uid).set({
                isAdmin: Boolean(false),
                firstName: firstName,
                lastName: lastName,
            }).then(() => {
                window.location.replace('index.html')
            }).catch((error) => {
                setErrorMessage(error);
            });
        }).catch((error) => {
            setErrorMessage(error);
        });
}

function signIn() {
    Swal.showLoading();
    var email = $('#input-email').val();
    var password = $('#input-password').val();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'account.html';
        })
        .catch((error) => { setErrorMessage(error); });
}

function signOut() {
    Swal.showLoading();
    firebase.auth().signOut().then(() => {

        window.location.href = 'login.html';
        localStorage.removeItem('isLoggedIn');
        localStorage.setItem('hasAdminRights', 'false');
    }).catch((error) => {

    });
}

function deleteAccount() {
    var user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid).delete().then(() => {


        user.delete().then(() => {
            signOut();
        });
    })
}

function addToCart(productId) {

    var user = firebase.auth().currentUser;

    if (!user) window.location.href = 'login.html';

    var cartItemId = firebase.firestore().collection('users').doc(user.uid).collection('cart').doc().id

    firebase.firestore().collection('users').doc(user.uid).collection('cart').where('id', '==', productId.toString()).get().then((query) => {
        if (query.size >= 1) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Item already in cart',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            firebase.firestore().collection('users').doc(user.uid).collection('cart').doc(cartItemId).set(({
                id: (productId).toString(),
                qty: 0,
                totalPrice: 0
            })).then(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Added item to cart',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
        }
    })


}

function removeFromCart(cartItem) {

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to remove this from your cart?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: 'var(--primary)',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {

            var user = firebase.auth().currentUser;
            firebase.firestore().collection('users').doc(user.uid).collection('cart').doc(cartItem.id).delete().then(() => {
                Swal.fire({
                    title: 'Deleted',
                    text: "Item removed from the cart",
                    icon: 'warning',
                })
            });

        }
    })



}

function addOrder(inputMethod, total) {
    Swal.fire({
        title: 'Processing',
        html: 'Your transaction is being finalized...',// add html attribute if you want or remove
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        },
    });
    var user = firebase.auth().currentUser;
    var orderId = firebase.firestore().collection('orders').doc().id;

    // Create new order
    firebase.firestore().collection('orders').doc(orderId).set(({
        userId: user.uid,
        totalAmount: total,
        paymentMethod: inputMethod,
        orderStatus: 'Processing'

    })).then(() => {
        // Clear user cart
        firebase.firestore().collection('users').doc(user.uid).collection('cart').get().then((query) => {
            var count = query.size;
            console.log(query.size)
            query.forEach((cartItem) => {
                firebase.firestore().collection('orders').doc(orderId).collection('items').doc().set(({
                    id: cartItem.data().id
                })).then(() => {
                    firebase.firestore().collection('users').doc(user.uid).collection('cart').doc(cartItem.id).delete();
                    count--;
                    if (count == 0) window.location.href = 'success.html';
                })
            })
        })
    })
}

function addItemGroup(category, type) {
    firebase.firestore().collection('item-categories').doc().set(({
        category: category,
        type: type
    }))
}

function reauthenticateUser(inputEmail, inputPassword) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
        inputEmail,
        inputPassword
    );
    user.reauthenticateWithCredential(credential).then(() => {
        console.log('Reauthenticate successful');
    }).catch((error) => {
        setErrorMessage(error);
    });
}

function updateUserPassword(newPassword) {
    reauthenticateUser($('#input-email').val(), $('#input-password-current').val())
    console.log(newPassword);
    var user = firebase.auth().currentUser;
    user.updatePassword(newPassword).then(() => {
        alert("Password changed successfuly");
        window.location.reload();
    }).catch((e) => {
        setErrorMessage(e);
    })
}

function addAppeal(appeal) {
    Swal.fire({
        title: 'Processing',
        html: 'Your appeal is being sent...',// add html attribute if you want or remove
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        },
    })

    console.log(appeal)
    firebase.firestore().collection('appeals').doc().set(({
        orderId: appeal.orderId,
        fullName: appeal.fullName,
        email: appeal.email,
        contact: appeal.contact,
        comment: appeal.comment,
        description: appeal.description,
        userId: firebase.auth().currentUser.uid,
        appealStatus: 'Waiting'
    })).then(() => {
        Swal.fire({
            title: 'Success!',
            text: 'Successfully sent an appeal. We will contact you as soon as possible.',
            confirmButtonText: 'Done',
            confirmButtonColor: 'var(--primary)'
        }).then((result) => {
            localStorage.removeItem('orderIdToAppeal');
            window.location.href = 'orders.html';
        })
    }).catch((e) => {
        console.log(e.msg)
    })
}
function updateOrderStatus(orderId, status) {
    firebase.firestore().collection('orders').doc(orderId).update(({
        orderStatus: status,
    })).then(() => {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Status updated',
            showConfirmButton: false,
            timer: 1500
        })
    })
}

function settleAppeal(appealId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to settle this appeal? This cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: 'var(--tertiary)',
        confirmButtonText: 'Yes, it is settled'
    }).then((result) => {
        if (result.isConfirmed) {

            firebase.firestore().collection('appeals').doc(appealId).update(({
                appealStatus: 'Settled'
            })).then(() => {
                Swal.fire({
                    title: 'Success',
                    text: "Appeal settled.",
                    icon: 'warning',
                    confirmButtonColor: 'var(--primary)'
                })
            });

        }
    })


}