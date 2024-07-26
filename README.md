# Cine EDI
CineEDI is an online VHS tape rental service with an EDI integration. The application features a database of around 200 films, using Express.js for the backend and MySQL for the relational database. The frontend is built with React Vite in TypeScript. Key information flow is managed through EDI documents.

## User Types:

### Client
Clients can browse the film database, create a favorites list, and manage their order history. They can add films to their favorites and place orders. Orders are saved in the history and can be deleted if not yet sent or marked as returned. Clients receive film recommendations based on their favorites.

### Administrator
Administrators can manage user accounts, including deletions. They can change order statuses, triggering corresponding events like sending an email confirmation and a PDF invoice when an order status is set to ‘paid’. Administrators also have access to analytical tools for viewing monthly order data and user-specific data, displayed in interactive charts.
Process:

## Registration and Login:
- Users register and activate their accounts via email verification.
- Users log in with their email and password.

## Contact Information:
- Users fill in contact details like shipping address and phone number.
- Ordering VHS Tapes:
- Users browse the VHS catalog, add titles to their cart, and finalize purchases.
- Order Confirmation and Shipping:
- Users receive an email confirmation with order details and estimated shipping date.
- Once the order is ready, users get a shipping email with a PDF invoice based on an EDI document.
- Receiving and Returning Tapes:
- Users receive the VHS tapes and pay on delivery.
- Users are reminded via email to return tapes before the due date.
- Users return tapes using the provided shipping label.

## Technologies:
### Backend:
- Express.js for the application and API.
- MySQL for the database.
- Middleware for security and file handling.
- EDI document processing and PDF generation.

### Frontend:
- React with TypeScript and Vite bundler.
- Material-UI for UI components.
- Axios for HTTP requests.
- Chart.js for data visualization.

### Database:
- Tables for accounts, orders, addresses, VHS tapes, and rentals.
- Relationships and constraints to maintain data integrity.

## EDI Integration:
- Automated EDI document generation and processing for order management.
- Efficient data handling and minimal storage requirements for EDI files.

For more details, explore the CineEDI documentation and experience the classic film rental service enhanced with modern technology.
