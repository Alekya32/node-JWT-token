//External Modules
var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var jwt=require("jsonwebtoken");
var morgan=require("morgan");
var router=express.Router();

//Internal Modules
var config=require("./config");
var User=require("./models/user")

mongoose.connect(config.DATABASECON,function(){
	console.log("Successfully connected to database")
})

app.use(morgan('dev'))
app.set('secretKey',config.SECRET)
console.log(app.get('secretKey'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


router.get("/",function(request,response){
	response.send("This is JWT Authentication App")
})

//getting all data
router.post("/createUser",function(request,response){
	var userObj=request.body;
	User.createUser(userObj,function(err,data){
		if(err){
			throw err;
		}
		response.json(data)
	})
})

//find through particular param
/*router.get("/userfind/:userName",function(request,response){
	var userName=request.params.userName;
	User.getUserByName(userName,function(err,data){
		if(err){
			throw err;
		}
		response.json(data)
	})
})*/

//finding all
/*router.get("/userfind",function(request,response){
	
	User.getUser(function(err,data){
		if(err){
			throw err;
		}
		response.json(data)
	})
})*/

router.post("/authenticate",function(request,response){
	

	var userName=request.body.name;//as we pass data in body we use this
	var password=request.body.password;	
	User.getUserByName(userName,function(err,user){
		if(err){
			throw err;
		}
		if(!user){//name user passsed in function
			response.json({
				success:false,
				message:"Authentication failed, user not found"
			})
		}
		else if(user){
			if(user.password != password){
				response.json({
					success:false,
					message:"Authentication failed,password doesn't match"
				})
			}
			else{

				var token=jwt.sign(user,app.get('secretKey'))
				response.json({
					success:true,
					message:"Here is your token",
					token:token
				})
			}
		}
	})
})

//middleware function to handle functionality

router.use(function(request,response,next){
	var token=request.body.token||request.query.token||request.headers["x-access-token"]
	if(token){
		jwt.verify(token,app.get('secretKey'),function(err,decoded){
			if(err){
	
		response.json({
						success:false,
						message:"Authentication failed,not a valid token"
				})
			}
			request.decoded=decoded;
				next();//method to call otherwise server will be hanged
		})
	}
	else{
		response.status(403).send({
			success:false,
			message:"Please provide a token"
		})
	}
});

router.get("/userfind",function(request,response){
	
	User.getUser(function(err,data){
		if(err){
			throw err;
		}
		response.json(data)
	})
})

app.use("/api",router);

var PORT=process.env.PORT||1337
app.listen(PORT,function(){
	console.log("Server Listening at ",+PORT)
})

