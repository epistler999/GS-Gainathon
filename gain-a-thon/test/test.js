const User = require('../models/User')
const app = require('../app') 
const logger = require('../utils/logger')
const Constant = require('../models/Constant')
const EventMentor = require('../models/EventMentor')
const Store = require('../models/Store')

const go = async() =>{

    // let item = new Store({
    //     item_id : 3,
    //     item_name : "L Lawliet",
    //     item_count : 1,
    //     item_cost : 500,
    //     item_link : "localhost:3001/api/store/item/3"
    // })

    // item.save();
    // let user = new User({
    //     email: "y@g.com",
    //     name: "a",
    //     points: 1000,
    //     password: "1234",
    //     type : "user",
    //     kt_given : 20
    //   });
    
    // await user.save()

    // user = new User({
    //     email: "b@g.com",
    //     name: "b",
    //     points: 100,
    //     password: "1234",
    //     type : "user",
    //     kt_given : 0
    //   });
    
    // await user.save()

    // user = new User({
    //     email: "c@g.com",
    //     name: "c",
    //     points: 100,
    //     password: "1234",
    //     type : "user",
    //     kt_given : 0
    //   });
    
    // await user.save()

    // user = new User({
    //     email: "d@g.com",
    //     name: "d",
    //     points: 100,
    //     password: "1234",
    //     type : "user",
    //     kt_given : 0
    //   });
    
    // await user.save()
    // .then(savedNote => {
    //     logger.info(JSON.stringify(savedNote));
    // })
    // .catch(error => logger.error(error))
    // User.deleteMany({}).then( () => {
    //     logger.info("deleted all !!!!");
    // }).catch(function(error){
    //     console.log(error); // Failure
    // });

    // User.find({}).then(res => {
    //     logger.info(res);
    // })
    // const x = User.find({})
    // logger.info("WTF",x);

    // const x = new Constant({
    //     kt_id : 1,
    //     event_creation_point : 1
    // })

    // x.save();

    // const user = await User.findOneAndUpdate({email : "sahiti@gainsight.com"} , {kt_given : 67});
    // console.log("TEST USER " , user);

//    const em =await EventMentor.find({email:"sahiti@gainsight.com"});
//     console.log("TEST eventMnetpr " , em.length);

//    User.updateMany({} , {kt_given : 0});

} 

module.exports = {
    go
};




