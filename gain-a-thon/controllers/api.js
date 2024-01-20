const emailValidator = require('email-validator');

const { response, off, request, map } = require('../app');

const fs = require('fs').promises;
const apirouter = require('express').Router()
const User = require('../models/User');
const Store= require('../models/Store');
const logger = require('../utils/logger');
const EventMentor=require('../models/EventMentor');
const KT=require('../models/KT');
const cors = require('cors');

const { count } = require('../models/User');
const Constant = require('../models/Constant');
const { unwatchFile } = require('fs');
const ItemRequests = require('../models/ItemRequests');

const image_links=["https://support.gainsight.com/@api/deki/files/18631/RED2.png?revision=1",
"https://support.gainsight.com/@api/deki/files/20525/Save_as_Draft.png?revision=1",
"https://support.gainsight.com/@api/deki/files/19912/Template_page.png?revision=1",
"https://support.gainsight.com/@api/deki/files/19878/CSQL_dashboard.png?revision=1",
"https://imageio.forbes.com/blogs-images/alexkonrad/files/2017/05/Gainsight-2.jpg?format=jpg&width=960",
"https://support.gainsight.com/@api/deki/files/6435/c360_summary.png?revision=1",
"https://support.gainsight.com/@api/deki/files/4558/Admin_%253E_Connectors_2.0.png?revision=1&size=bestfit&width=733&height=345",
]
 apirouter.post('/login', async (request, response) => {
  try{
    // if(!request.session.count ){
  //   request.session.count = 1;
  // }else{
  //   request.session.count += 1;
  // }

  console.log("bruh...",request.session.count);

  const email = request.body.email
  const password = request.body.password

  console.log("email : ", email)
  console.log("password : ",password)

  const result = await User.findOne({email : email});
  if(result === null){
    const obj = {
      msg : "Please register first"
    } 
    response.set(request.session.sessionID);
    return response.status(400).json(JSON.stringify(obj));
  }

  logger.error("WTF ", result);

  if(result.password !== password){
    const obj = {
      msg : "Wrong Password"
    } 
    return response.status(200).json(JSON.stringify(obj));
  }

  if(result.password === password){
    const obj = {
      msg : "Valid user"
    } 
    request.session.email = email;
    request.session.name = result.name;
    request.session.points = result.points;
    return response.status(200).json(JSON.stringify(obj));
  }

  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));
  }catch(e){
    logger.error("OOOOOPS" , e);
    response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
  }

  
})

apirouter.post('/register',async(request,response) => {
try{  
  console.log("REGISTER ENDPOINT HIT WITH BODY" , request.body)
  const name = request.body.name;
  const email =  request.body.email;
  const password = request.body.password;
  let passwordPattern = /^[A-Za-z0-9]\w{4,16}$/;
  
  if(!passwordPattern.test(password)){
    const obj = {
      msg: "Wrong Password Format"
    }
    return response.status(400).json(JSON.stringify(obj))
  }

  const result = await User.findOne({email : email});

  if(result !== null){
    console.log("pass");
    const obj = {
      msg: "User with given email already exists"
    }
    return response.status(400).json(JSON.stringify(obj))
  }
  
  const user = new User({
        email,
        name,
        password,
        points : 0,
        type : "user",
        kt_given : 0
      });

  await user.save()

  request.session.email = email;
  request.session.name = user.name;
  request.session.points = user.points;

  const obj = {
    msg: "User Registered Succesfully"
  }
  response.status(200).json(JSON.stringify(obj))
}
catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
 })

apirouter.post('/logout', async (request, response) => {
  try{
  request.session.destroy();
  return response.status(200).send(JSON.stringify({"msg" : "user logged out"}))
  }catch(e){
    logger.error("OOOOOPS" , e);
    response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
  }
})

apirouter.get('/user/:sort', async (request, response) => {
  // if(request.session.email === undefined){
  //   return response.status(400).json(JSON.stringify({"msg" : "Please login first"}));
  // }
  try{
  const sort=request.params.sort;
  const userList = await User.find().select('-_id email name points kt_given')

  console.log('WTF' , userList);
  if(sort==='count'){
  userList.sort( (a,b) =>  {
    if(a.kt_given == b.kt_given){
      return a.email > b.email ? 1 : -1;
    }
    return a.kt_given < b.kt_given ? 1 : -1;
  })}
  else{
    userList.sort( (a,b) =>  {
      if(a.points == b.points){
        return a.email > b.email ? 1 : -1;
      }
      return a.points < b.points ? 1 : -1;
    })
  }

  return response.status(200).json(JSON.stringify(userList));
}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
});

// apirouter.get('/' , (request,response)){
  
// }

apirouter.post('/event',async(request,response)=>{
  // if(request.session.email === undefined){
  //   return response.status(400).json(JSON.stringify({"msg" : "Please login first"}));
  // }
try{  
  const mentor_email=request.body.email;
  const kt_link=request.body.link;
  const kt_topic=request.body.topic;
  const kt_desc=request.body.description;
  const max_limit=7;
  let randomNumber=Math.random() * max_limit;
  randomNumber=Math.floor(randomNumber);
  console.log("random ",randomNumber);

  const kt_image_link=image_links[randomNumber];
  let constant_details=await Constant.find();
  console.log('GOT HERE');
  let kt_id = constant_details[0].kt_id;
  let points = constant_details[0].event_creation_point;
  logger.info('CONSTANTS : ', kt_id , points);
  const eventMentor = new EventMentor({
    kt_id,
    mentor_email
  });
  logger.info(eventMentor);
  await eventMentor.save().catch((error) => {
    logger.info("Error Ocuured ",error);
  });

 
  const kt=new KT({
    kt_id,
    kt_link,
    kt_topic,
    kt_desc,
    kt_image_link
  })

  await kt.save().catch((error) => {
    logger.info("Error Ocuured ",error);
  });
  console.log(kt);
  let prev_kt_id=kt_id;
  kt_id++;
  let y= await Constant.findOneAndUpdate({kt_id:prev_kt_id},{kt_id:kt_id});
  logger.info("X ",y); 
  const obj = {
    msg: "Uploaded KT details sucessfully",
  }
  let USER =await User.findOne({email:mentor_email}).select('points kt_given');
  console.log('UUUUUU' , USER);
  let userPoints = USER.points;
  await User.findOneAndUpdate({email:mentor_email},{kt_given: USER.kt_given + 1});

  console.log("hello2",userPoints);
  userPoints=points+userPoints;
  let x = await User.findOneAndUpdate({email:mentor_email},{points:userPoints});

  logger.info("X ",x); 
  response.status(200).json(JSON.stringify(obj))

}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}

})

apirouter.get('/ktList' , async (request,response) => {
  const result = await KT.find().select('-_id kt_topic kt_link kt_desc kt_image_link');
  console.log(result);
  return response.status(200).json(JSON.stringify(result));
})

apirouter.post('/ktList',async(request,response)=>{
  // if(request.session.email === undefined){

  //   return response.status(400).json(JSON.stringify({"msg" : "Please login first"}));
  // }
try{
   const mentor_email=request.body.email;
   const eventMentorList=await EventMentor.find();
   console.log("eventttt",eventMentorList);
   const ktIdList=[];
   let j=0;
   eventMentorList.forEach(eventMentor => {
    const email=eventMentor.mentor_email;
    if(email===mentor_email)
    {
      ktIdList[j++]=eventMentor.kt_id;
    }
  })


  console.log("ktidlist",ktIdList);
  let kt_details_list = [];
   
  const result= await KT.find({ kt_id : { "$in" : ktIdList }}).select('-_id kt_topic kt_link kt_desc kt_image_link');

  console.log("result" , result);
  for(let i = 0 ;  i < ktIdList.length ; ++i){
    const result = await KT.findOne({kt_id: ktIdList[i]});
    console.log(result);
    kt_details_list.push({description:result.kt_desc,link:result.kt_link,topic:result.kt_topic,image_link:result.kt_image_link});
  }


  
  console.log(':o' , kt_details_list)
  response.status(200).json(JSON.stringify(result)); 

}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({}));  
}
});

apirouter.get('/user/profile/:email',async (request,response)=>{
  try{
  const email=request.params.email;
  const userDetails=await User.findOne({email:email});
  const eventMentorList=await EventMentor.find();
   const ktIdList=[];
   let j=0;
   eventMentorList.forEach(eventMentor => {
    const mentor_email=eventMentor.mentor_email;
    if(mentor_email===email)
    {
      ktIdList[j++]=eventMentor.kt_id;
    }
  })
  logger.info(ktIdList);
  const result= await KT.find({ kt_id : { "$in" : ktIdList }}).select('-_id kt_topic kt_link kt_desc');
  logger.info(userDetails);

  const allRequestbyUser = await ItemRequests.find({email : email})
  console.log("herelokesh : ", allRequestbyUser)

  if(allRequestbyUser === [] ){
    response.status(200).send(JSON.stringify({ msg : [] }))
  }
  const allItemsRequestedByUser  = []
  let i=0
  allRequestbyUser.forEach(item=> {
    allItemsRequestedByUser[i++] = item.item_name   
  })

  console.log("zerotwo : ", allItemsRequestedByUser)
  const map = new Map()
  for ( const item of allItemsRequestedByUser){
    if(map.get(item)){
      let count = map.get(item) + 1
      map.set(item,count)
    }
    else{
      map.set(item,1)
    }
  }

  console.log("MMMMMMMMMMMMMMMMMMMM" , map);
  const sendOBJ = []
  let x=0
 for(let [key,value] of map){
    const item = await Store.findOne({item_name:key})
    console.log("here : " + key + " : " + value + " : " + item.item_name)
    const obj = {
      count : value,
      item_name : key,
      cost : item.item_cost
    }
    sendOBJ[x++] = obj
}
console.log("lokesh singh ",  sendOBJ)
  const userProfile={
    name:userDetails.name,
    email: email,
    points:userDetails.points,
    kt_list:result,
    item_list:sendOBJ
  };

  console.log('XXXXXXXX' , userProfile);
  response.status(200).json(JSON.stringify(userProfile));
  }catch(e){
    response.status(500).json(JSON.stringify({msg : "Internal Server Error"}));
  }
  
});

apirouter.get('/store/item/:id' , async (request,response) => {
  // if(request.session.email === undefined){
  //   return response.status(400).json(JSON.stringify({"msg" : "Please login first"}));
  // }
try{
  const id = request.params.id;

  try{
    const image = await fs.readFile(`./images/${id}.png`)
    response.setHeader('content-type', 'image/png');
    return response.status(200).send(image);
  }catch(e){
    return response.status(400).send(JSON.stringify({msg : "No image with this name :( "}))
  }
}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
})


// apirouter.post('/store',async(req,res) => {
// try{  
//   const item_id = req.body.item_id
//   const item_name = req.body.item_name
//   const item_cost = req.body.item_cost
//   const item_count = req.body.item_count
//   const result = await Store.findOne({item_id : item_id})
//   if(result != null){
//     const obj = {
//       msg: 'item id already exists'
//     }
//     return res.status(400).json(JSON.stringify(obj))
//   }
//   const store = new Store({
//     item_id,
//     item_name,
//     item_count,
//     item_cost
//   })
//   await store.save()
//   const obj = {
//     msg: 'Store details stored Succesfully',
//   }
//   return res.status(200).json(JSON.stringify(obj))
// }catch(e){
//   logger.error("OOOOOPS" , e);
//   res.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
// }
// });


apirouter.get('/store', async (request, response) => {
try{
  const itemList=await Store.find();
  const itemOBJlist = []
  let i=0;
  itemList.forEach(storevalue => {
    console.log('CHECK' , storevalue)
    const storeobj = {
      item_id : storevalue.item_id,
      item_cost : storevalue.item_cost,
      item_name : storevalue.item_name,
      item_count : storevalue.item_count,
      item_link : storevalue.item_link
    }
    itemOBJlist[i++] = storeobj
  })

  console.log('ALLITEMS' , itemOBJlist);
  return response.status(200).json(JSON.stringify(itemOBJlist));
}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
});

apirouter.get('/store/:data', async (request, response) => {
try{  
  var data = request.params.data
  item_id = Number(data)
  const item=await Store.findOne({item_id : item_id});
  if(item === null){
    const obj = {
      msg: 'item id does not exists'
    }
    return response.status(400).json(JSON.stringify(obj))
  }
  const requested_item = item
  return response.status(200).json(JSON.stringify(requested_item));
}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
});

apirouter.post('/store/item/redeem',async(request,response) => {
  try{
    const email = request.body.email
    const item_id = Number(request.body.item_id)
    const item = await Store.findOne({item_id : item_id})
    const user = await User.findOne({email : email});

    if(user === null){
      const obj = {
        msg: 'Unsuccessful'
      }
      return response.status(200).json(JSON.stringify(obj))  
    }
    if(item === null){
      const obj = {
        msg: 'Unsuccessful'
      }
      return response.status(200).json(JSON.stringify(obj))  
    }

    if(item.count == 0){
      const obj={
        msg : 'Unsuccessful'
      }
      return response.status(200).json(JSON.stringify(obj))
    }

    if (user.points < item.item_cost){
      const obj={
        msg : 'Unsuccessful'
      }
      return response.status(200).json(JSON.stringify(obj))
    }

    await User.findOneAndUpdate({email: email}, {$set:{points: user.points - 1}})

    await Store.findOneAndUpdate({item_id : item_id} , {$set:{item_count: item.item_count - 1}});
    // User.findOneAndUpdate({email: email}, {$set:{points: user.points - 1}})
    // user.points -= item.item_cost
    // user.save();

    logger.info(user.name+"'s "+ item.item_cost + " points were deducted, current points left : "+user.points)
    const item_name = item.item_name
    const itemRequest = new ItemRequests({
      email ,
      item_name,
      item_id
    });
    await itemRequest.save()
    
    const successOBJ = {
      msg : "Successful"
    }
    return response.status(200).json(JSON.stringify(successOBJ))

  }catch(e){
    logger.error("OOOOOPS" , e);
    response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
  }
})

apirouter.get('/view-requests',async(request,response) => {
try{
  const allRequests = await ItemRequests.find();
  const requestList = []
  let i=0
  allRequests.forEach(request => {
    const reqObj = {
      email : request.email,
      item_name : request.item_name
    }
  requestList[i++] = reqObj
  })
  return response.status(200).json(JSON.stringify(requestList));

}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}
})

apirouter.post('/user/item',async(request,response) => {
try{
  const email = request.body.email
  const allRequestbyUser = await ItemRequests.find({email : email})
  if(allRequestbyUser === [] ){
    response.status(200).send(JSON.stringify({ msg : [] }))
  }
  const allItemsRequestedByUser  = []
  let i=0
  
  allRequestbyUser.forEach(item=> {
    allItemsRequestedByUser[i++] = item.item_name    
  })

  const  map = new Map()
  for ( const item of allItemsRequestedByUser){
    if(map.get(item)){
      let count = map.get(item) + 1
      map.set(item,count)
    }
    else{
      map.set(item,1)
    }
  }
  const sendOBJ = []
  let x=0
  console.log("lokesh : ", map)
 for(let [key,value] of map){
    const item = await Store.findOne({item_name:key})
    console.log("here : " + key + " : " + value + " : " + item.item_name)
    const obj = {
      count : value,
      item_name : key,
      cost : item.item_cost
    }
    console.log(obj)
    sendOBJ[x++] = obj
}
 
  response.status(200).send(JSON.stringify(sendOBJ))

}catch(e){
  logger.error("OOOOOPS" , e);
  response.status(500).send(JSON.stringify({ msg : "Sorry, something went wrong"}));  
}

})

module.exports = apirouter;



// {
//   email : 
//   password : 
// }
