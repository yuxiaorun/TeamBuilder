function distance(player1, player2) {
    var dist = 0;
    var dim = player1.favoriteGameType.length;
    for (var i = 0; i < dim; i++) {
        dist += (player1.favoriteGameType[i] - player2.favoriteGameType[i]) * (player1.favoriteGameType[i] - player2.favoriteGameType[i])
    }
    return [dist, player2]
}

function recommend(Users, player, k, res) {
    var platformList = player.platform;
    var gameList = player.playingGames;
    var query = {"username": {"$nin":player.friends},"playingTime": player.playingTime, "platform": {"$in": platformList}, "playingGames":{"$in": gameList}};
    Users.find(query, (err, doc)=> {
        if (err) {
            on_err(req, res, err, "error when finding orders.");
        }else{
            if(doc) {
                var distList = [];
                for(var i = 0; i < doc.length; i++) {
                    if(doc[i].username !== player.username){
                        distList.push(distance(player, doc[i]));
                    }
                }
                distList.sort(function (a, b) {
                    return (a[0] - b[0])
                });
                var recommendationList = distList.slice(0, k);
                res.json({
                        status: '200',
                        message: "Recomendation returned: ",
                        result: {
                            recommendationList: recommendationList
                        }

                });
            }

        }
    });
}

module.exports = recommend;
