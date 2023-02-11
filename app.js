const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      drive: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
        SELECT * FROM
        cricket_team;`;

  const playersDetail = await db.all(getPlayerQuery);
  response.send(playersDetail);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO 
    cricket_team(playerName, jerseyNumber, role)
    Values
    (
     '${playerName}',
     ${jerseyNumber},
     '${role}'
    );`;
  const newPlayerDetail = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const onePlayerQuery = `
    SELECT * 
    FROM 
    cricket_team
    WHERE 
    player_id = ${playerId};`;

  const player = await db.get(onePlayerQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerDetail = request.body;
  const { playerName, jerseyNumber, role } = updatePlayerDetail;

  const updatePlayerQuery = `UPDATE 
        cricket_team
    SET
    playerName='${playerName}',
    jerseyNumber=${jerseyNumber},
    role='${role}';`;

  await db.run(updatePlayerDetail);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
        DELETE FROM 
        cricket_team
        WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
