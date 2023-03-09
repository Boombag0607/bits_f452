App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Verification.json", function (verification) {
      App.contracts.Verification = TruffleContract(verification);

      App.contracts.Verification.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function () {},

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
      }
    });
  },

  signCustomer: function () {
    var name = $("#name").val();
    var dob = $("#dob").val();
    var bankAccount = $("#account").val();
    var message = name + dob + bankAccount;

    message = web3.sha3(message);

    $("#accountAddress").html("Your Ethereum Account: " + App.account);

    $("#messageHolder").html("Your unique message is: " + message);

    web3.eth.sign(App.account, message, function (error, signature) {
      App.contracts.Verification.deployed()
        .then(function (instance) {
          verificationInstance = instance;
          verificationInstance.addCustomerSignature(bankAccount, signature);
          // return signature;
        })
        .catch(function (error) {
          console.warn(error);
        });
    });
  },

  verifyCustomer: function () {
    var name = $("#name").val();
    var dob = $("#dob").val();
    var bankAccount = $("#account").val();
    var account = $("#ethAccount").val();
    var message = name + dob + bankAccount;
    console.log("here1");

    message = web3.sha3(message);

    App.contracts.Verification.deployed()
      .then(function (instance) {
        App.verificationInstance = instance;
        console.log("here2");
        return instance.getCustomerSignature(bankAccount);
      })
      .then(function (signature) {
        console.log("here5");
        if (signature == "") {
          alert("No signature found on ethereum");
        } else {
          c;

          $("#signatureHolder").html(
            "Customer's signature is: <br> " + signature
          );

          if (!web3.isAddress(account)) {
            alert("Invalid ethereum address");
            return;
          }

          App.verificationInstance
            .verifyCustomerSignature(message, account, signature)
            .then(function (verificationStatus) {
              console.log("here2");
              if (verificationStatus == true) {
                alert("verification success");
              } else {
                alert("verification failed");
              }
            })
            .catch(function (error) {
              console.log("here3");
              console.warn(error);
            });
        }
      })
      .catch(function (error) {
        console.log("here4");
        console.log(error);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
