const express = require('express');
const router = express.Router();
const connection = require('../db');


router.post('/api/flag-unflag', (req,res) =>{
    //console.log('POST /api/flag-unflag')
    const {postToFlag} = req.body;
    //console.log(postToFlag)
    //console.log(req.session.reg_user_id)

    connection.query(`INSERT INTO PostFlag (reg_user_id, post_id) VALUES ('${req.session.reg_user_id}', '${postToFlag}')`,
        function(err, result){
            if(err){
                //console.log(err)
                if(err.errno == 1062){
                    //console.log(1062);
                    connection.query(
                        `DELETE FROM PostFlag
                        WHERE (PostFlag.reg_user_id = '${req.session.reg_user_id}'
                        AND PostFlag.post_id = '${postToFlag}')`,
                        function(err,deleteResult){
                            if(err){
                                //console.log(err);
                            }
                            else{
                                //console.log('Unflagged the Post')
                                //console.log(deleteResult);
                                res.status(200).json('unflag')
                            }
                        }
                    )
                }
            }
            else{
                //console.log('Successfully flagged the post')
                res.status(200).json('unflag')
                //console.log(result);
            }
        }
    )
})

module.exports = router