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

1. Set up email with Amazon. Verify email and test recipient. [x]
2. Set up function to send emails using SDK [x]
3. Set up email / key database and class [x]
4. Set up controllers and routers and adjust signup router [x]
5. Change sign up work flow to have welcome [x]
6. Set up landing page when coming from email [x]
7. Set up new type of status (email confirmed in front and backend types) [x]
8. Ensure that all auth and admin elements are not affected by new possibility [x]
9. Only allow moderators to approve email confirmed peeps [x]
10. Set up MYSQL to delete any email / key entries older than 24 hours

### Comments

- Allow for deletion of comments by self or by admin / moderator [x]

  1. Create endpoint that deletes comments -include checks to see if appropriate user does this [x]
  2. Create delete button for deletion of comments frontend [x]
  3. Have this delete the comment from state on success [x]
  4. Put in error messaging into comments - Determine where to hold this information [x]

- Allow for editing of comments by self or by admin / moderator

  1. This should just be a case of creating some new endpoints. [x]
  2. Update the actual DB to reflect a new updatedAt and updatedByWho (should reference users table) [x]
  3. Make changes to types on frontend and backend to include extra columns [x]
  4. Make changes to comment fetch to include the potential updatedAt and updatedByWho [x]
  5. Add in edit opportunities - can I reuse the comment box but just prepopulate it with text? Will need to change the endpoint depending on whether reply / comment / edit - have this only be available for moderator / admin / own user [x]
  6. Add in who who edited and when edited to comment [x]

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

  1. Remove number from the service. - is there a way to retroactively do this to the table maybe just have to do this all again - copy all numbers into text file -
     Just bluntly get rid of the whole column. And just a have a many to one relationship with this other table. Change type, remove numbers from base service altogether, have it extend between the base service and subcategories (this can be done for the emails)
  2. Create a table for numbers, this should have a id, serviceId, details, number, secret. [x]
     - Add create multiple to our generic class - we should be able to string construct this however it will need to be checked for safety [x] (done this in js not in SQL)
     - Create a class for serviceNumbersDB - create (should create multiple) / update / delete [x]
  3. Make adjustment to service type to have a multiple values for contact numbers.[x]
  4. Adjust the fetch service builder. At this point should I be looking to just build it as one fetch request, perhaps do this in the async manner or just start building a big SQL query. Unsure. Will have to look at this further. See whether there is a way I can hold the needsMet etc. as an array or not. If not maybe no point in holding it all as a query and just do it in js. Will have to join parent and child onto this as a child will have to reference its parent - join the forwardTo onto this. [x] (this has been done in just javascript rather than SQL query)
  5. Make changes to service base type to reflect number being an empty array. [x]
  6. Create a type for numbers [x]
  7. On the frontend make changes to service base type to reflect change in number.[x]
  8. On the frontend make changes to Service Display - Should this be a drop down or just a list?[x]
  9. Have a way to create a new service number in the service cration form[x]
  10. Allow numbers to be removed from the create number input once they have been added[x]
  11. Set up the numbers to be edited[x]

  - we need to pass the value from the main value - see what's being sent back[x]
  - we need to display the list of numbers within the input form and allow them to be removed and added back in. Actual editing sounds like hassle.[x]
  - Ensure that server does not serve private services to non approved users [x]

  ### Multiple Emails - Pretty much the sma kinda job as the contacts

1. Create DB class for Email Contacts Table [x]
2. Create all basic functions for this class [x]
3. Update ServiceType and create Email type [x]
4. Update Service Type to reflect change to email [x]
5. Update create Service in Service DB to add in multiple emails [x]
6. Update update service in serviceDB to update multiple emails [x]
7. Update fetch service and what is returned in the controller [x]
8. Change frontend types [x]
9. update service display [x]
10. update serviceForm [x]

### Responsiveness

- run through the site and check for responsiveness []
- there seems to be some issue with how the contact-data is being laid out [x]
- there are already some issues around sizing when Text Display is at phone width [x]

### Uploading Images To S3

- Set up an AWS account [x]
- Get the most simple version up and running [x]
- Create ImageDB class [x]
- Create s3 ability to put / delete and getSignedUrl [x]
- Update frontend to allow to update services and create services with multiple images [x]
- update frontend to display a slide show to view the pictures [x]
- allow for primary image to be selected, allow click to set primary pic. Update SQL table and types. [x]
- set display of service to depend on what is available multiple images or just the single outdated version [x]

### Upload other files such as application forms etc.

- Create OtherFilesDB class [x]
- Create Endpoint to upload file through multer middleware (have this is services)[x]
- Create FileType front and backend [x]
- Create function to upload and save file to db that will cover images and files as refactor [x]
  Commit = refactored upload and file save and implemented into file and image controllers, made adjustment to timing of deleltion of updated pictures
- Adjust service form creation to allow for file uploads []
- handle upload and parsing of the information []

### Error handle and rollback Database interactions

- We need to find a way that we find a stable connection from the connection pool to work between various DB classes and methods. [x]
- May have to redesign and pass a connection.getConnection() into the methods and grab this one connection from the parent DB. [x]
- Need to pass the error handling one level higher and probably need to handle by creating some error codes or perhaps error ENUMS or something []
- So we will handle the connection.beginTransaction and the rollback wherever we have the try catch, so if we're just throwing errors then pass the connection in. If it's fully self-contained, do the transaction in that try catch block. [x]

### Fix Frontend Issue with Report not sitting on top

- Perhaps change z-index?
