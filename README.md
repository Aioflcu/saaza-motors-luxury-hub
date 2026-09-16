# Saaza Motors Luxury Hub

Build a modern luxury automotive import and sales platform named "Saaza Motors", modeled after the structure, features, and user flow of B&B Auto Imports (https://bbautoimports.com).



Please implement the  requirements from B and B



.

3. Enhanced Vehicle Detail View / Gallery:

   - Interactive car detail modal or page with a rich photo gallery component.

   - Must support viewing 10+or less high-resolution photos per vehicle (exterior angles, interior details, engine bay, dashboard, wheels, etc.).

   - Displays full technical specifications, features, and an interactive financing calculator.

4. Custom Vehicle Import Portal: Form allowing clients to submit custom import sourcing requests, automatically routing their vehicle specs directly to sales via WhatsApp and Email.

5. Auth & Admin Dashboard:

   - Authentication system supporting Client and Admin roles.

   - Dedicated Admin Control Panel to manage live inventory (add, edit, remove cars).

   - Multi-Photo Management: The admin must be able to upload/attach 10 or more different images for each car (including engine, interior, exterior, etc.).

   - Real-time Updates: Any newly added or edited car and its full image gallery must instantly reflect across the public user inventory and vehicle detail views.

   - Monitor and manage incoming client custom sourcing requests.



Populate the site with realistic luxury vehicle mock data, ensuring each mock car includes a full gallery of 10+ images so all features, filters, and admin updates are fully functional out of the box. 

Implement a secure Admin Authentication System for the Saaza Motors platform with the following specifications:



1. Access Point: A dedicated Admin Login route/modal separate from standard user features, accessible via an "Admin Portal" link or `/admin` route.



2. Credentials & Auth Logic:

   - Hardcode default admin demo credentials:

     • Username / Email: Saaza

     • Password: Saaza1234

   - Validate credentials with error handling (e.g., "Invalid Admin Credentials") for incorrect inputs.



3. Session & Route Protection:

   - Upon successful login, switch application state to Admin Mode and automatically redirect to the Admin Control Dashboard.

   - Restrict access to all management features (Inventory CRUD, Sourcing Requests) unless authenticated as Admin.

   - Include a "Log Out" button in the admin header that clears the session and returns to the public home page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bab59a9f-a0c6-4d26-a313-94b495eebdac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
