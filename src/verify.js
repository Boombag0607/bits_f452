document.getElementById("buttonSubmit").onclick = function verifyCustomer(e) {
    e.preventDefault();
    console.log('123');
    var signature          = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 16; i++ ) {
        signature += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("signatureHolder").innerHTML = "Customer's signature is: <br> " + signature;
}
verifyCustomer();