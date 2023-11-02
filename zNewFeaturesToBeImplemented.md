### Expand Categories List [x]

- Include - Minorities / Education and Employment / LGBT+
  1. Change Theme Types to Include new Category forwardTo [x]
  2. Add in additional theme colors and all the different variations [x]
  3. Add new themeColorTypes to enum [x]
  4. Set new Theme Colors in categoryThemes.ts Map [x]
  5. Change categoryTypes on server [x]
  6. Manually add categories to db [x]

### Include Email Verification -

Will need to add a new category of verified but not approved.

1. do some serious research

### Comments

- Allow for editing and deletion of comments by self or by admin / moderator

  1. This should just be a case of creating some new endpoints.
  2. Update the actual DB to reflect a new updatedAt and updatedByWho (should reference users table)
  3. Make changes to comment fetch to include the potential updatedAt and updatedByWho(will have to join this on)
  4. Add delete end point. This should be straightforward due to cascade delete. [x]
  5. Add in edit opportunities - can I reuse the comment box but just prepopulate it with text? Will need to change the endpoint depending on whether reply / comment / edit - have this only be available for moderator / admin / own user
  6. Add in delete opportunities - have this only be available for moderator /admin /own user

- Allow for hiding of comments with enough downvotes
  1. Conditionally render comment based on downvotes and instead placing a "Downvoted too many times" view anyways tab.
  2. Create state that will keep track of viewable flag

### Child / Parent Services

    - Change services to allow for a service to be linked to a parent service.

### Multiple Contacts

- Allow for services to hold multiple different contact numbers. Each contact number should have a name or details associated with it as well as a number.
  1. Remove number from the service. - is there a way to retroactively do this to the table maybe just have to do this all again - copy all numbers into text file
  2. Create a table for numbers, this should have a id, details, number, secret.
     - Add create multiple to our generic class - we should be able to string construct this however it will need to be checked for safety
     - Create a class for serviceNumbersDB - create (should create multiple) / update / delete
  3. Make adjustment to service to have a multiple values for contact numbers.
  4. Adjust the fetch service builder. At this point should I be looking to just build it as one fetch request, perhaps do this in the async manner or just start building a big SQL query. Unsure. Will have to look at this further. See whether there is a way I can hold the needsMet etc. as an array or not. If not maybe no point in holding it all as a query and just do it in js. Will have to join parent and child onto this as a child will have to reference its parent - join the forwardTo onto this.
  5. Make changes to service base type to reflect number being an empty array.
  6. Create a type for numbers
  7. On the frontend make changes to service base type to reflect change in number.
  8. On the frontend make changes to Service Display - Should this be a drop down or just a list?

### Change how DB Class event handling is done.

- Let the errors throw and handle this within the controllers or other functions that consume them. No error handling within the DB classes.
- Will need to remove the rrors as well as how all consuming functions process errors

### Change controllers to reflect updated typescripting namespace

-remove things such as casting, unnecessary type checking etc.
