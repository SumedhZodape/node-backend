const http = require('http');
const url = require('url');
const fs = require('fs');

let server = http.createServer((req, res)=>{

    // console.log(req.method)
    // console.log(req.url)

    const parsedURL = url.parse(req.url, true);

    // console.log(parsedURL)
    // console.log(parsedURL.query)



    if(req.method === "GET" && parsedURL.path ==="/getusers"){


        // to get all the users

        const userData = JSON.parse(fs.readFileSync('./users.json', 'utf-8'))

        res.write(JSON.stringify({
            message:"User fetched",
            success: true,
            result: userData
        }))
        res.end()
    }
    else if(req.method === "GET" && parsedURL.pathname ==="/getusers" 
        && parsedURL.query.id !==null){

            const userData = JSON.parse(fs.readFileSync('./users.json', 'utf-8'))

            let singleUser = userData.find((ele, index)=>{
                return Number(ele.id) === Number(parsedURL.query.id)
            })


            if(singleUser){
                res.write(JSON.stringify(
                    {
                        message:"Single user fetched",
                        success: true,
                        result: singleUser
                    }
                ))
                res.end()
            }else{
                res.write(JSON.stringify({
                    message: "USER NOT FOUND",
                    success:false
                }))
                res.end()
            }

    }
    else if(req.method === "DELETE" && parsedURL.pathname === "/deleteuser" 
        && parsedURL.query.id !== null
    ){
        const id = parsedURL.query.id; // 2
        let userData = JSON.parse(fs.readFileSync('./users.json', 'utf-8')) // [{id:2}]


        // const userIndex = userData.findIndex((ele, index)=>Number(ele.id) === Number(id))
        const userIndex = userData.findIndex((ele, index)=>{
            return Number(ele.id) === Number(id)
        })

        if(userIndex !== -1){

            userData.splice(userIndex, 1)

            fs.writeFileSync('./users.json', JSON.stringify(userData))

            res.write(JSON.stringify({
                message:"User Deleted Successfully.",
                success:true
            }))
            res.end()
            
        }else{
            res.write(JSON.stringify({
                message:"Invalid User ID",
                success: false
            }))
            res.end()
        }

    }
    else if(req.method === "POST" && parsedURL.path==="/addnewuser"){


        let data = "";

        req.on("data", (chunk)=>{

            data += chunk;

        })

        req.on("end", ()=>{


            let userData = [];
            
            let fileData = fs.readFileSync('./users.json', 'utf-8')

            if(fileData){
                userData = JSON.parse(fileData)
            }

            let id = 1;

            if(userData.length > 0){
                let lastEle = userData[userData.length - 1]
                
                id = Number(lastEle.id) + 1;
            }


            userData.push({id: id, ...JSON.parse(data)})


            fs.writeFileSync('users.json', JSON.stringify(userData))
            res.write(JSON.stringify({
                message:"User Added Successfully",
                success: true
            }))
            res.end()
        })

    }
    else{
        res.write(JSON.stringify({
            message:"Server Error",
            success: false
        }));
        res.end()
    }


   



})

server.listen(8000, ()=>{
    console.log("SERVER IS RUNNING...")
})