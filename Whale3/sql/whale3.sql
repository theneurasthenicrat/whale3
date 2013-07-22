
DROP TABLE PollAttributes;
DROP TABLE CandidateAttributes;
DROP TABLE UserAttributes;
DROP TABLE Conflicts;
DROP TABLE Votes;
DROP TABLE Dates;
DROP TABLE Candidates;
DROP TABLE InvitedUsers;
DROP TABLE Polls;
DROP TABLE RegisteredUsers;
DROP TABLE Users;
DROP TABLE PreferenceModels;

DROP SEQUENCE PollIds;
DROP SEQUENCE UserIds;


CREATE SEQUENCE PollIds;
CREATE SEQUENCE UserIds;

CREATE TABLE PreferenceModels (
       preferenceModelId VARCHAR(20) PRIMARY KEY
);

CREATE TABLE Users (
       userId VARCHAR(10) PRIMARY KEY,
       nickName VARCHAR(30)
);

CREATE TABLE RegisteredUsers (
       userId VARCHAR(10) PRIMARY KEY REFERENCES Users(userId),
       eMail VARCHAR(30) UNIQUE,
       password CHAR(40)
);

CREATE TABLE Polls (
       pollId VARCHAR(10) PRIMARY KEY,
       pollTitle VARCHAR(80),
       pollDescription VARCHAR(300),
--       anonimity INT, -- 0 for open ballots free participation (classic poll); 1 for anonymous on invitation (classic vote); 2 for open ballots on invitation only
       creationDate TIMESTAMP,
       closingDate TIMESTAMP,
       pollType INT, -- 0 for classic; 1 for date
       preferenceModel VARCHAR(20) REFERENCES PreferenceModels(preferenceModelId),
       owner VARCHAR(10) REFERENCES RegisteredUsers(userId)
);

CREATE TABLE InvitedUsers (
       userId VARCHAR(10) PRIMARY KEY,
       eMail VARCHAR(30),
       certificate CHAR(32),
       pollId VARCHAR(10) REFERENCES Polls(pollId),
       FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

CREATE TABLE Candidates (
       pollId VARCHAR(10) REFERENCES Polls(pollId),
       candidateNumber INT,
       candidateLabel VARCHAR(80),
       PRIMARY KEY (pollId, candidateNumber)
);

CREATE TABLE Dates (
       pollId VARCHAR(10),
       candidateDay DATE,
       candidateNumber INT, -- Candidate number is the timeslot number concerning this date
       timeSlotLabel VARCHAR(80),
       PRIMARY KEY (pollId, candidateDay, candidateNumber),
       FOREIGN KEY (pollId) REFERENCES Polls(pollId)
);

CREATE TABLE Votes (
       pollId VARCHAR(10) REFERENCES Polls(pollId),
       voteNumber INT,
       userId VARCHAR(10) REFERENCES Users(userId),
       val VARCHAR(300),
       lastModification TIMESTAMP,
       PRIMARY KEY (pollId, voteNumber)
);

CREATE TABLE Conflicts (
       userId VARCHAR(10) REFERENCES Users(userId),
       pollId1 VARCHAR(10),
       candidateNumber1 INT,
       pollId2 VARCHAR(10),
       candidateNumber2 INT,
       PRIMARY KEY (userId, pollId1, candidateNumber1, pollId2, candidateNumber2),
       CHECK (pollId1 <> pollId2),
       FOREIGN KEY (pollId1, candidateNumber1) REFERENCES Candidates(pollId, candidateNumber),
       FOREIGN KEY (pollId2, candidateNumber2) REFERENCES Candidates(pollId, candidateNumber)
);

-- These three tables enable an extension of the model by providing
-- a way to express combinations of unpredicted (key, value) pairs

CREATE TABLE UserAttributes (
       userId VARCHAR(10),
       attributeKey VARCHAR(80),
       attributeValue VARCHAR(80),
       PRIMARY KEY (userId, attributeKey),
       FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE CandidateAttributes (
       pollId VARCHAR(10),
       candidateNumber INT,
       attributeKey VARCHAR(80),
       attributeValue VARCHAR(80),
       PRIMARY KEY (pollId, candidateNumber, attributeKey),
       FOREIGN KEY (pollId, candidateNumber) REFERENCES Candidates(pollId, candidateNumber)
);

CREATE TABLE PollAttributes (
       pollId VARCHAR(10),
       attributeKey VARCHAR(80),
       attributeValue VARCHAR(80),
       PRIMARY KEY (pollId, attributeKey),
       FOREIGN KEY (pollId) REFERENCES Polls(pollId)
);




