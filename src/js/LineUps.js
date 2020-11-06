import config from "./Config.js";

export default class LineUps {
    constructor(clubName1, clubName2, onPlayerCardsData) {

        this.onPlayerCardsData = onPlayerCardsData;
        this.clubName2 = clubName2;
        this.testClub1 = [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "GK",
                player_img_id: '011'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 20,
                special: null,
                position: "DF1",
                player_img_id: '001'
            },
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "3052FF",
                attack_full: 20,
                special: null,
                position: "DF2",
                player_img_id: '007'
            },
            {
                defense_current: 0,
                defense_color: "FF9702",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "MD1",
                player_img_id: '008'
            },
            {
                defense_current: 0,
                defense_color: "2F7F07",
                defense_full: 20,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 20,
                special: null,
                position: "MD2",
                player_img_id: '018'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "F",
                player_img_id: '010'
            }
        ];

        this.testClub2 = [
            {
                defense_current: 0,
                defense_color: "FF1D00",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "GK",
                opponent_img_id: '009'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "2F7F07",
                attack_full: 20,
                special: null,
                position: "DF1",
                opponent_img_id: '003'
            },
            {
                defense_current: 0,
                defense_color: "B200FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF1D00",
                attack_full: 20,
                special: null,
                position: "DF2",
                opponent_img_id: '004'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "FF9702",
                attack_full: 20,
                special: null,
                position: "MD1",
                opponent_img_id: '005'
            },
            {
                defense_current: 0,
                defense_color: "3052FF",
                defense_full: 20,
                attack_current: 0,
                attack_color: "E2D841",
                attack_full: 20,
                special: null,
                position: "MD2",
                opponent_img_id: '006'
            },
            {
                defense_current: 0,
                defense_color: "E2D841",
                defense_full: 20,
                attack_current: 0,
                attack_color: "B200FF",
                attack_full: 20,
                special: null,
                position: "F",
                opponent_img_id: '007'
            }
        ]

        this.clubData(clubName1);
        // this.clubData(clubName2, true);

    }
    clubData(clubName, secondTeam) {
        if (config.addTeam) {//for tests only for now...add club to DB
            $.ajax({
                url: "addClub",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: clubName, players: this[clubName] }),
                success: (res) => {
                    console.log(res);
                }
            });
        } else {
            console.log("getClubsPlayers request")
            $.ajax({
                url: "/getClubsPlayers",
                type: 'POST',
                contentType: 'application/json',
                mode: 'no-cors',
                "Access-Control-Allow-Origin": "*",
                data: JSON.stringify({ name: clubName }),
                success: (res) => {
                    alert("lineups!!!!")
                    if (!secondTeam) {
                        this.player = res.clubData.players;
                        this.clubData(this.clubName2, true);
                    } else {
                        this.opponent = res.clubData.players;
                        this.onPlayerCardsData();
                    }
                }, error: (error) => {
                    throw new Error("request getClubsPlayers failed")
                }
            });
        }
    }
}