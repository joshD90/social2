### Expand Categories List

- Include - Minorities / Education and Employment / LGBT+
  1. Change Theme Types to Include new Category forwardTo
  2. Add in additional theme colors and all the different variations
  3. Add new themeColorTypes to enum
  4. Set new Theme Colors in categoryThemes.ts Map
  5. Change categoryTypes on server
  6. Manually add categories to db

### Include Email Verification -

Will need to add a new category of verified but not approved.

1. do some serious research

### Comments

- Allow for editing and deletion of comments by self or by admin / moderator

  1. This should just be a case of creating some new endpoints.
  2. Update the actual DB to reflect a new updatedAt and updatedByWho (should reference users table)
  3. Make changes to comment fetch to include the potential updatedAt and updatedByWho(will have to join this on)
  4. Add delete end point. This should be straightforward due to cascade delete.
  5. Add in edit opportunities - can I reuse the comment box but just prepopulate it with text? Will need to change the endpoint depending on whether reply / comment / edit - have this only be available for moderator / admin / own user
  6. Add in delete opportunities - have this only be available for moderator /admin /own user

- Allow for hiding of comments with enough downvotes
  1. Conditionally render comment based on downvotes and instead placing a "Downvoted too many times" view anyways tab.
  2. Create state that will keep track of viewable flag
