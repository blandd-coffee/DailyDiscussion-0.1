## users

user_id INT UNSIGNED
name VARCHAR(255)
username VARCHAR(64)
email VARCHAR(255)

## discussions

discussion_id INT UNSIGNED
title VARCHAR(255)
content TEXT
active_date DATE
created_at DATETIME

## responses

response_id INT UNSIGNED
author_id INT UNSIGNED
content TEXT
parent_response_id INT UNSIGNED
reaction_type ENUM('like','dislike','favorite')
reacted_by INT UNSIGNED

## ROUTES

## USER
GET /api/users          | Gets all users
GET /api/users/:id      | Gets a single user by user ID
GET /api/users/search   | Geys a user by query (user=?)
POST /api/users         | (name, username, gmail) Creates a user
DELETE /api/users       | (id) Deletes a user

## DISCUSSION
GET /api/discussion     | Gets current days discussion
GET /api/discussion/:id | Gets a discuission by ID
GET /api/unscheduled    | Gets all unscheduled discussions
PUT /api/discussion     | (id, title?, content?, ?active) updates a discussion
DELETE /api/discussion  | (id) deletes a discussion
