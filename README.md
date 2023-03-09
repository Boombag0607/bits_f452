# Fair Transaction
-
The contract solves the following problem-

Suppose there is a new website named xyz.com which is offering heavy discounts and also there is a website abc.com which is offering high-quality items at the same price as of Amazon. But any normal user will be hesitant to buy any item from abc.com or xyz.com due to the lack of trust (ie after payment xyz.com may not deliver the item, etc) although xyz.com and abc.com are offering better products at a lower price.

I tried to solve this problem by building a smart contract that sends the amount to xyz.com only when the item has been delivered to the user and off- loading of the item starts only when the user has paid the amount of the item to the smart contract which is deployed on the blockchain.

Using a state variable `currentState` which uses template of `State` to denote different events in the transaction which gets initalised to `AWAITING_PAYMENT` inside the constructor. The `owner` is the inital party to call the functions.
`currentState` changes with the completion of every event divided in the 3 functions for each situation.

`sendPayment()` and `confirmDelivery()` function can be called by the buyer only, as indicated by the `modifier`. The buyer makes payment and confirms if they recieved the item.
`refundBuyer()` is to be called by `owner` of the smart contract to reverse transact the balance in case of unsuccessful delivery.