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

- Allow for deletion of comments by self or by admin / moderator [x]

  1. Create endpoint that deletes comments -include checks to see if appropriate user does this [x]
  2. Create delete button for deletion of comments frontend [x]
  3. Have this delete the comment from state on success [x]
  4. Put in error messaging into comments - Determine where to hold this information [x]

- Allow for editing of comments by self or by admin / moderator

  1. This should just be a case of creating some new endpoints.
  2. Update the actual DB to reflect a new updatedAt and updatedByWho (should reference users table)
  3. Make changes to comment fetch to include the potential updatedAt and updatedByWho(will have to join this on)
  4. Add in edit opportunities - can I reuse the comment box but just prepopulate it with text? Will need to change the endpoint depending on whether reply / comment / edit - have this only be available for moderator / admin / own user

- Allow for hiding of comments with enough downvotes
  1. Conditionally render comment based on downvotes and instead placing a "Downvoted too many times" view anyways tab. [x]
  2. Create state that will keep track of viewable flag [x]
  3. Set env variable to determine limit [x]

### Child / Parent Services

- Change services to allow for a service to be linked to a parent service.

1. Update services table to include parent id. [x]
2. Update base service type on backend to include parent id as possible.[x]
3. Update overall service type to include an array of children [x]
4. Update the ServiceDB Creation [x]
5. Update service fetch query to include a list of id's and names - look at search functionality for how to do this [x]
6. Include any parent services in this fetch [x]
7. Update Service Display to have a dropdown if there are children. Have these link to another service. [x]
8. Display parent information on service display and have this link to the parent. [x]

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
