INSERT INTO `football`.`match`
(`id`,
`competitionID`,
`date`,
`home`,
`away`,
`data`)
VALUES
(9029,
null,
"1999-02-12",
"Home Team",
"Away Team",
null);

SELECT `user`.`id`,
    `user`.`username`,
    `user`.`hash`,
    `user`.`admin`,
    `user`.`regkey`,
    `user`.`token`
FROM `football`.`user`;


