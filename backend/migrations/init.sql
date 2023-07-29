CREATE USER 'Ludo'@'localhost' IDENTIFIED BY 'ispitivac';

GRANT CREATE, ALTER, DROP,
INSERT,
UPDATE,
DELETE,
SELECT
,
    REFERENCES,
    RELOAD on *.* TO 'Ludo' @'localhost'
WITH
GRANT OPTION;


CREATE DATABASE Ludo;

USE Ludo;

CREATE TABLE users (
  userId INT AUTO_INCREMENT,
  userName VARCHAR(50) NOT NULL,
  image VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY (userId)
);

ALTER TABLE users CHANGE COLUMN image image TINYINT UNSIGNED NULL;



CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gameId VARCHAR(250) NOT NULL,
  playerOne INT NOT NULL,
  playerTwo INT NOT NULL,
  playerThree INT,
  playerFour INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playerOne) REFERENCES users(userId),
  FOREIGN KEY (playerTwo) REFERENCES users(userId),
  FOREIGN KEY (playerThree) REFERENCES users(userId),
  FOREIGN KEY (playerFour) REFERENCES users(userId)
);

SELECT 
  g.gameId,
  JSON_ARRAY(
    JSON_OBJECT('playerId', g.playerOne, 'username', u1.username),
    JSON_OBJECT('playerId', g.playerTwo, 'username', u2.username),
    JSON_OBJECT('playerId', g.playerThree, 'username', u3.username),
    JSON_OBJECT('playerId', g.playerFour, 'username', u4.username)
  ) AS players
 FROM games g
 LEFT JOIN users u1 ON g.playerOne = u1.userId
 LEFT JOIN users u2 ON g.playerTwo = u2.userId
 LEFT JOIN users u3 ON g.playerThree = u3.userId
 LEFT JOIN users u4 ON g.playerFour = u4.userId
 WHERE g.gameId = ?;
