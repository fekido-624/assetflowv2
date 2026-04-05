# **App Name**: AssetFlow

## Core Features:

- Secure Authentication & User Roles: Implement a robust login system with Admin and User roles, ensuring appropriate access permissions for data interaction and system functionalities.
- Staff & Department Management: Enable comprehensive CRUD operations (Add, Edit, Delete, View) for staff records, including their personal details, job role, department, wing, and employment status. Staff search by name is included.
- Asset & Printer Lifecycle Management: Provide full CRUD operations for all asset types (PC, Laptop, Phone, Tablet) and printers. Includes features for assigning assets to staff, tracking detailed specifications like brand, model, acquisition type, registration/rental codes, serial numbers, location, and status updates.
- Automated Asset Audit Trail: Automatically log significant changes to an asset, specifically tracking modifications to its acquisition type. All previous and new data will be stored, along with the date and user responsible for the change, creating an immutable audit history.
- Intelligent Asset Query & Discovery: A powerful search system to efficiently locate staff and assets using multiple criteria such as staff name, asset type, registration number, rental code, and serial number.
- Dynamic Dashboard & Insights: A central dashboard providing a real-time overview of key metrics, including total staff, assets, and printers. Visual representations of assets distributed by wing and acquisition type will be displayed for quick administrative insights.
- Exportable Reports Tool: Generate and export detailed asset data reports to an Excel (.xlsx) file, with filtering options based on staff name, wing, asset type, or acquisition type.
- Asset History Summarizer Tool: Given an asset's full audit history, this tool will leverage generative AI to analyze the records (e.g., changes in ownership, status, notes) and provide a concise summary of the asset's lifecycle, identifying key events or potential utilization trends for administrators.

## Style Guidelines:

- Primary color: A deep, professional blue (#2952A3) to convey reliability and efficiency.
- Background color: A very light, subtle blue-grey (#F0F2F4) for clear content presentation and reduced eye strain.
- Accent color: A vibrant cyan-green (#26DBBB) for calls to action, highlights, and to provide energetic contrast.
- All text will use 'Inter' (sans-serif), chosen for its excellent readability across all screen sizes and its clean, modern, and objective appearance suitable for data-heavy applications.
- Use a consistent set of clean, line-based icons for clarity across the application's interface, indicating actions, categories, and status at a glance. Prioritize simplicity and immediate recognition.
- Adopt a clean, grid-based layout for optimal presentation of tabular data and structured input forms. Emphasis will be placed on intuitive navigation and clear visual hierarchy to enhance user productivity.
- Incorporate subtle and swift animations for interactive elements such as filtering data, sorting columns, and form submissions. These transitions will provide immediate feedback to the user without causing distraction.