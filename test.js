import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/labour/create';  // Replace with your actual API endpoint

  // Replace with your actual API endpoint
const siteId = '678c8f02e48d91e3a85e8880';  // Replace with the actual siteId

const labours = [
    // Category: Carpenter
    { name: 'Labour 1', phoneNo: '9876543201', category: 'Carpenter', subCategory: 'Framework', wagesPerShift: 500 },
    { name: 'Labour 2', phoneNo: '9876543202', category: 'Carpenter', subCategory: 'Framework', wagesPerShift: 520 },
    { name: 'Labour 3', phoneNo: '9876543203', category: 'Carpenter', subCategory: 'Framework', wagesPerShift: 530 },
    { name: 'Labour 4', phoneNo: '9876543204', category: 'Carpenter', subCategory: 'Finishing', wagesPerShift: 540 },
    { name: 'Labour 5', phoneNo: '9876543205', category: 'Carpenter', subCategory: 'Finishing', wagesPerShift: 550 },
    { name: 'Labour 6', phoneNo: '9876543206', category: 'Carpenter', subCategory: 'Finishing', wagesPerShift: 560 },

    // Category: Electrician
    { name: 'Labour 7', phoneNo: '9876543207', category: 'Electrician', subCategory: 'Wiring', wagesPerShift: 600 },
    { name: 'Labour 8', phoneNo: '9876543208', category: 'Electrician', subCategory: 'Wiring', wagesPerShift: 610 },
    { name: 'Labour 9', phoneNo: '9876543209', category: 'Electrician', subCategory: 'Wiring', wagesPerShift: 620 },
    { name: 'Labour 10', phoneNo: '9876543210', category: 'Electrician', subCategory: 'Panel Installation', wagesPerShift: 630 },
    { name: 'Labour 11', phoneNo: '9876543211', category: 'Electrician', subCategory: 'Panel Installation', wagesPerShift: 640 },
    { name: 'Labour 12', phoneNo: '9876543212', category: 'Electrician', subCategory: 'Panel Installation', wagesPerShift: 650 },

    // Category: Plumber
    { name: 'Labour 13', phoneNo: '9876543213', category: 'Plumber', subCategory: 'Sanitary', wagesPerShift: 550 },
    { name: 'Labour 14', phoneNo: '9876543214', category: 'Plumber', subCategory: 'Sanitary', wagesPerShift: 560 },
    { name: 'Labour 15', phoneNo: '9876543215', category: 'Plumber', subCategory: 'Sanitary', wagesPerShift: 570 },
    { name: 'Labour 16', phoneNo: '9876543216', category: 'Plumber', subCategory: 'Fittings', wagesPerShift: 580 },
    { name: 'Labour 17', phoneNo: '9876543217', category: 'Plumber', subCategory: 'Fittings', wagesPerShift: 590 },
    { name: 'Labour 18', phoneNo: '9876543218', category: 'Plumber', subCategory: 'Fittings', wagesPerShift: 600 },

    // Category: Mason
    { name: 'Labour 19', phoneNo: '9876543219', category: 'Mason', subCategory: 'Brickwork', wagesPerShift: 500 },
    { name: 'Labour 20', phoneNo: '9876543220', category: 'Mason', subCategory: 'Brickwork', wagesPerShift: 510 },
    { name: 'Labour 21', phoneNo: '9876543221', category: 'Mason', subCategory: 'Brickwork', wagesPerShift: 520 },
    { name: 'Labour 22', phoneNo: '9876543222', category: 'Mason', subCategory: 'Plastering', wagesPerShift: 530 },
    { name: 'Labour 23', phoneNo: '9876543223', category: 'Mason', subCategory: 'Plastering', wagesPerShift: 540 },
    { name: 'Labour 24', phoneNo: '9876543224', category: 'Mason', subCategory: 'Plastering', wagesPerShift: 550 },

    // Category: Painter
    { name: 'Labour 25', phoneNo: '9876543225', category: 'Painter', subCategory: 'Interior', wagesPerShift: 600 },
    { name: 'Labour 26', phoneNo: '9876543226', category: 'Painter', subCategory: 'Interior', wagesPerShift: 610 },
    { name: 'Labour 27', phoneNo: '9876543227', category: 'Painter', subCategory: 'Interior', wagesPerShift: 620 },
    { name: 'Labour 28', phoneNo: '9876543228', category: 'Painter', subCategory: 'Exterior', wagesPerShift: 630 },
    { name: 'Labour 29', phoneNo: '9876543229', category: 'Painter', subCategory: 'Exterior', wagesPerShift: 640 },
    { name: 'Labour 30', phoneNo: '9876543230', category: 'Painter', subCategory: 'Exterior', wagesPerShift: 650 },
];

const addLabours = async () => {
    for (const labour of labours) {
        try {
            const response = await axios.post(`${apiUrl}?siteId=${siteId}`, labour);
            console.log(`Success: ${response.data.message}`, response.data.labour);
        } catch (error) {
            console.error(`Error adding ${labour.name}:`, error.response ? error.response.data : error.message);
        }
    }
};

addLabours();
