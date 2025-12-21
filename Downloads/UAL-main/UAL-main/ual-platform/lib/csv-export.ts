/**
 * CSV Export Utilities
 * Functions to export CRM data to CSV format
 */

export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        // Header row
        headers.join(','),
        // Data rows
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Handle values that might contain commas or quotes
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportContactsToCSV(contacts: any[]) {
    const formattedData = contacts.map(contact => ({
        'First Name': contact.firstName,
        'Last Name': contact.lastName,
        'Email': contact.email,
        'Phone': contact.phone,
        'Company': contact.company,
        'Job Title': contact.jobTitle,
        'Status': contact.status,
        'Created At': contact.createdAt instanceof Date
            ? contact.createdAt.toISOString()
            : contact.createdAt
    }));

    exportToCSV(formattedData, 'contacts');
}

export function exportCompaniesToCSV(companies: any[]) {
    const formattedData = companies.map(company => ({
        'Company Name': company.name,
        'Industry': company.industry,
        'Size': company.size,
        'Revenue': company.revenue,
        'Website': company.website,
        'Address': company.address,
        'Created At': company.createdAt instanceof Date
            ? company.createdAt.toISOString()
            : company.createdAt
    }));

    exportToCSV(formattedData, 'companies');
}
