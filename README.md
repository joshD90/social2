# social2
An OOP revamp with updated code practices for Homeless Social Care Site.

## Purpose of this Project
This project is to give an accessible list of services available for people who are homeless.  This is primarily aimed towards key workers who wish to support their clients.

## Features
### Services
A user is greeted with a log in, log ins are secured with JWT and Passport.js.  We can access limited features of the website through the guest access.  Once logged in we view the primary layout section which has a dynamic list component and a view section which changes depending on where in the navigation is.  We can access different categories and then the services that are in the list.
In the navbar is a search box where the user can search for services.  This will return services that match that keyword based on how relevant it is.  It will also display the differing headings that these key words are under.
A user can submit a report on any errors that may be present for any service.  This allows the admin to view these issues that have been reported.

### Admin
If logged in as an admin you can switch into admin mode.  In admin mode you can create a service, through a multistep form.  Updating, viewing and deleting are also possible.
