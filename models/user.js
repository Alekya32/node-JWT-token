var mongoose=require("mongoose")
var userSchema=mongoose.Schema({
		name:{
			type:String
		},
		password:{
			type:String
		},
		admin:{
			type:Boolean
		}
})

var User=module.exports=mongoose.model("user",userSchema,"userData")

module.exports.createUser=function(userObj,callback){
	return User.create(userObj,callback);
}

module.exports.getUserByName=function(userName,callback){
	return User.findOne({name:userName},callback);//name:DB name,userName:
}

module.exports.getUser=function(callback){
	return User.find(callback);//name:DB name,userName:
}