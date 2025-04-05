### /users

**Description**

- Each document represents a user’s account.

**IDs**

- **documentId**: Auto Generated. The user’s Firebase Auth UID (e.g., "user123”)
- **userId**: Same as documentId.

**Properties**

```json
{
  "createdAt": "<timestamp>",
  "displayName": "Jane Smith",
  "email": "email@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "updatedAt": "<timestamp>",
  "userId": "user123"
}
```

### /sources

**Description**

- Each document represents a source supported by DigiShelf (like Goodreads, BoardGameGeek, IMDB, etc).
- Each document includes data for rendering that source to users and data needed to create Integrations.
- ~~Each document will include the settings supported by that source.~~

**IDs**

- **documentId**: Auto Generated.
- **sourceId**: Same as documentId.

**Properties**

```json
{
  "createdAt": "<timestamp>",
  "displayName": "Goodreads",
  "shelves": ["All", "Read", "Currently Reading", "Want to Read"],
  "sourceId": "source123",
  "originalURL": "https://www.goodreads.com/",
  "updatedAt": "<timestamp>"
}
```

**Queries**

- getAllSources

### /integrations

**Description**

- Each document represents an integration — a connection between a user a supported source — and any associated settings.

**IDs**

- **documentId**: Auto Generated.
- integrationId: Same as documentId.
- **userId**: documentID from /users.
- **sourceId**: documentID from /sources.

**Properties**

```json
{
  "createdAt": "<timestamp>",
  "displayName": "Goodreads",
  "integrationId": "integration123",
  "originalURL": "https://www.goodreads.com/",
  "sourceId": "source123",
  "updatedAt": "<timestamp>",
  "userId": "user123",
  {{...settings}},
}
```

**Queries**

- getUserIntegrations(`userId`)

**Notes**

- Each integration will inherit settings from its source and be customized to the user’s preferences.
  - Goodreads
    ```json
    {
      "accountSlug": "{{1234-jane-smith}}",
      "myBooksURL": "https://www.goodreads.com/review/list/{{1234-jane-smith}}",
      "shelves": ["All", "Read", "Currently Reading", "Want to Read"]
    }
    ```

### /shelves

**Description**

- Each document represents a unique shelf. Shelves are automatically created by an integration.

**IDs**

- **documentId**: Auto Generated.
- **shelfId**: Same as documentId.
- **userId**: documentID from /users.
- **sourceId**: documentID from /sources.
- **integrationId**: documentID from /integrations.

**Properties**

```json
{
  "createdAt": "<timestamp>",
  "displayName": "Read",
  "integrationId": "integration123",
  "shelfId": "shelf123",
  "shelfURL": "https://digishelf.app/userId/shelfId",
  "sourceDisplayName": "Goodreads",
  "sourceId": "source123",
  "updatedAt": "<timestamp>",
  "userId": "user123",
  {{...settings}},
}
```

**Queries**

- getUserShelves(`userId`)

**Notes**

- [Someday] Shelves may also have user-specified settings.
- Each integration will inherit settings from its source and be customized to the user’s preferences.
  - Goodreads
    ```json
    {
      "originalURL": "https://www.goodreads.com/review/list/{{1234-jane-smith}}"
    }
    ```

### /items

**Description**

- Each document represents a unique shelf. Shelves are automatically created by an integration.

**IDs**

- **documentId**: Auto Generated.
- **itemId**: Same as documentId.
- **shelfId**: documentID from /shelves.
- **userId**: documentID from /users.
- **sourceId**: documentID from /sources.
- **integrationId**: documentID from /integrations.

**Properties**

```json
{
  "createdAt": "<timestamp>",
  "integrationId": "integration123",
  "itemId": "item123",
  "primaryColor": "#f4860a",
  "shelfId": "shelf123",
  "sourceId": "source123",
  "updatedAt": "<timestamp>",
  "userId": "user123",
  {{...metadata}},
}
```

**Queries**

- getShelfItems(`shelfId`)

**Notes**

- Items will have some universal metadata properties and some unique properties depending on its source.
  - Universal
    ```json
    {
      "author": "Collins, Jim",
      "canonicalURL": "https://www.goodreads.com/book/show/76865.Good_to_Great",
      "coverImage": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1546097703l/76865.jpg",
      "sourceRating": "",
      "title": "Wind and Truth",
      "userRating": "",
      "userReview": ""
    }
    ```
  - Goodreads
    ```json
    {
    	TBD
    }
    ```
  - BoardGameGeek
    ```json
    {
    	TBD
    }
    ```
