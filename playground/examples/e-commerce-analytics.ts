import { QueryBuilder, filterData, getFlatKeys } from '../../src';

// Define a complex data structure for e-commerce analytics
export interface Customer {
    id: string;
    name: string;
    email: string;
    registeredAt: Date;
    demographics: {
        age?: number;
        gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
        location: {
            country: string;
            city?: string;
            postalCode?: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            };
        };
        preferences?: {
            categories: string[];
            brands: string[];
            priceRange?: {
                min: number;
                max: number;
            };
            notifications: {
                email: boolean;
                sms: boolean;
                push: boolean;
                frequency: 'daily' | 'weekly' | 'monthly' | 'none';
            };
        };
    };
    membership: {
        tier: 'bronze' | 'silver' | 'gold' | 'platinum';
        points: number;
        since: Date;
        benefits: string[];
        paymentMethods: {
            type: 'credit' | 'debit' | 'paypal' | 'crypto' | 'other';
            isDefault: boolean;
            lastDigits?: string;
            expiryDate?: Date;
            billingAddress?: {
                line1: string;
                line2?: string;
                city: string;
                state?: string;
                country: string;
                postalCode: string;
            };
        }[];
    };
    orderHistory: {
        id: string;
        date: Date;
        items: {
            productId: string;
            name: string;
            category: string[];
            quantity: number;
            unitPrice: number;
            discount?: number;
            specifications: Record<string, string | number | boolean>;
            ratings?: {
                overall: number;
                aspects: {
                    quality?: number;
                    value?: number;
                    delivery?: number;
                };
                review?: {
                    text: string;
                    date: Date;
                    helpfulVotes: number;
                };
            };
        }[];
        payment: {
            method: string;
            total: number;
            currency: string;
            status: 'pending' | 'completed' | 'failed' | 'refunded';
            transactionId: string;
        };
        shipping: {
            method: string;
            address: {
                line1: string;
                line2?: string;
                city: string;
                state?: string;
                country: string;
                postalCode: string;
            };
            status: 'processing' | 'shipped' | 'delivered' | 'returned';
            trackingNumber?: string;
            estimatedDelivery?: Date;
            actualDelivery?: Date;
            returnRequested?: boolean;
            returnReason?: string;
        };
    }[];
    activities: {
        type: 'view' | 'search' | 'wishlist' | 'cart' | 'review' | 'referral';
        timestamp: Date;
        details: {
            productId?: string;
            productName?: string;
            searchQuery?: string;
            pageUrl?: string;
            duration?: number; // seconds
            deviceInfo?: {
                type: 'mobile' | 'tablet' | 'desktop';
                browser: string;
                os: string;
            };
            location?: string;
            referralSource?: string;
            campaign?: string;
        };
    }[];
}

// Create sample data
export const customers: Customer[] = [
    {
        id: 'c1001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        registeredAt: new Date('2023-03-15T09:30:00Z'),
        demographics: {
            age: 32,
            gender: 'female',
            location: {
                country: 'USA',
                city: 'Seattle',
                postalCode: '98101',
                coordinates: {
                    latitude: 47.6062,
                    longitude: -122.3321
                }
            },
            preferences: {
                categories: ['electronics', 'books', 'home-decor'],
                brands: ['Apple', 'Samsung', 'IKEA'],
                priceRange: {
                    min: 50,
                    max: 1000
                },
                notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    frequency: 'weekly'
                }
            }
        },
        membership: {
            tier: 'gold',
            points: 5600,
            since: new Date('2023-03-15'),
            benefits: ['free-shipping', 'exclusive-deals', 'early-access'],
            paymentMethods: [
                {
                    type: 'credit',
                    isDefault: true,
                    lastDigits: '4567',
                    expiryDate: new Date('2025-12-01'),
                    billingAddress: {
                        line1: '123 Pine Street',
                        city: 'Seattle',
                        state: 'WA',
                        country: 'USA',
                        postalCode: '98101'
                    }
                },
                {
                    type: 'paypal',
                    isDefault: false,
                    billingAddress: {
                        line1: '123 Pine Street',
                        city: 'Seattle',
                        state: 'WA',
                        country: 'USA',
                        postalCode: '98101'
                    }
                }
            ]
        },
        orderHistory: [
            {
                id: 'o10001',
                date: new Date('2024-02-15T14:30:00Z'),
                items: [
                    {
                        productId: 'p5001',
                        name: 'Smartphone XS Max',
                        category: ['electronics', 'smartphone'],
                        quantity: 1,
                        unitPrice: 899.99,
                        discount: 50,
                        specifications: {
                            color: 'black',
                            storage: '256GB',
                            warranty: '2 years'
                        },
                        ratings: {
                            overall: 4.8,
                            aspects: {
                                quality: 5,
                                value: 4.5,
                                delivery: 5
                            },
                            review: {
                                text: 'Excellent phone, fast delivery!',
                                date: new Date('2024-02-20T10:15:00Z'),
                                helpfulVotes: 12
                            }
                        }
                    },
                    {
                        productId: 'p5002',
                        name: 'Phone Case',
                        category: ['accessories', 'smartphone'],
                        quantity: 2,
                        unitPrice: 29.99,
                        specifications: {
                            color: 'clear',
                            material: 'silicone',
                            compatible: 'Smartphone XS Max'
                        }
                    }
                ],
                payment: {
                    method: 'credit',
                    total: 909.97,
                    currency: 'USD',
                    status: 'completed',
                    transactionId: 't200145'
                },
                shipping: {
                    method: 'express',
                    address: {
                        line1: '123 Pine Street',
                        city: 'Seattle',
                        state: 'WA',
                        country: 'USA',
                        postalCode: '98101'
                    },
                    status: 'delivered',
                    trackingNumber: 'TRK789456123',
                    estimatedDelivery: new Date('2024-02-18'),
                    actualDelivery: new Date('2024-02-17')
                }
            },
            {
                id: 'o10002',
                date: new Date('2024-03-20T11:45:00Z'),
                items: [
                    {
                        productId: 'p5003',
                        name: 'Wireless Earbuds',
                        category: ['electronics', 'audio'],
                        quantity: 1,
                        unitPrice: 159.99,
                        specifications: {
                            color: 'white',
                            batteryLife: '24 hours',
                            waterResistant: true
                        },
                        ratings: {
                            overall: 4.2,
                            aspects: {
                                quality: 4.5,
                                value: 3.8,
                                delivery: 5
                            }
                        }
                    }
                ],
                payment: {
                    method: 'paypal',
                    total: 159.99,
                    currency: 'USD',
                    status: 'completed',
                    transactionId: 't200146'
                },
                shipping: {
                    method: 'standard',
                    address: {
                        line1: '123 Pine Street',
                        city: 'Seattle',
                        state: 'WA',
                        country: 'USA',
                        postalCode: '98101'
                    },
                    status: 'delivered',
                    trackingNumber: 'TRK789456124',
                    estimatedDelivery: new Date('2024-03-25'),
                    actualDelivery: new Date('2024-03-24')
                }
            }
        ],
        activities: [
            {
                type: 'view',
                timestamp: new Date('2024-04-10T08:30:00Z'),
                details: {
                    productId: 'p5004',
                    productName: 'Smart Watch Series 5',
                    pageUrl: '/products/smart-watch-series-5',
                    duration: 180,
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Safari',
                        os: 'iOS 14.5'
                    }
                }
            },
            {
                type: 'cart',
                timestamp: new Date('2024-04-10T08:35:00Z'),
                details: {
                    productId: 'p5004',
                    productName: 'Smart Watch Series 5',
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Safari',
                        os: 'iOS 14.5'
                    }
                }
            },
            {
                type: 'search',
                timestamp: new Date('2024-04-11T14:20:00Z'),
                details: {
                    searchQuery: 'waterproof bluetooth speakers',
                    deviceInfo: {
                        type: 'desktop',
                        browser: 'Chrome',
                        os: 'macOS'
                    },
                    duration: 120
                }
            }
        ]
    },
    {
        id: 'c1002',
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        registeredAt: new Date('2022-11-05T15:45:00Z'),
        demographics: {
            age: 45,
            gender: 'male',
            location: {
                country: 'Canada',
                city: 'Toronto',
                postalCode: 'M5V 2A8',
                coordinates: {
                    latitude: 43.6532,
                    longitude: -79.3832
                }
            },
            preferences: {
                categories: ['sports', 'outdoors', 'tools'],
                brands: ['Nike', 'Adidas', 'DeWalt'],
                priceRange: {
                    min: 20,
                    max: 500
                },
                notifications: {
                    email: true,
                    sms: true,
                    push: false,
                    frequency: 'daily'
                }
            }
        },
        membership: {
            tier: 'platinum',
            points: 12400,
            since: new Date('2022-11-05'),
            benefits: ['free-shipping', 'exclusive-deals', 'early-access', 'concierge', 'premium-support'],
            paymentMethods: [
                {
                    type: 'credit',
                    isDefault: true,
                    lastDigits: '7890',
                    expiryDate: new Date('2026-08-01'),
                    billingAddress: {
                        line1: '456 Maple Avenue',
                        city: 'Toronto',
                        state: 'ON',
                        country: 'Canada',
                        postalCode: 'M5V 2A8'
                    }
                }
            ]
        },
        orderHistory: [
            {
                id: 'o20001',
                date: new Date('2024-01-25T09:15:00Z'),
                items: [
                    {
                        productId: 'p8001',
                        name: 'Running Shoes Pro',
                        category: ['sports', 'footwear'],
                        quantity: 1,
                        unitPrice: 129.99,
                        specifications: {
                            color: 'blue',
                            size: '10.5',
                            gender: 'male'
                        },
                        ratings: {
                            overall: 5,
                            aspects: {
                                quality: 5,
                                value: 4.8,
                                delivery: 5
                            },
                            review: {
                                text: "Best running shoes I've ever had!'",
                                date: new Date('2024-02-10T16:30:00Z'),
                                helpfulVotes: 28
                            }
                        }
                    },
                    {
                        productId: 'p8002',
                        name: 'Sports Water Bottle',
                        category: ['sports', 'accessories'],
                        quantity: 2,
                        unitPrice: 24.99,
                        specifications: {
                            color: 'green',
                            capacity: '32oz',
                            material: 'stainless steel'
                        }
                    }
                ],
                payment: {
                    method: 'credit',
                    total: 179.97,
                    currency: 'CAD',
                    status: 'completed',
                    transactionId: 't300145'
                },
                shipping: {
                    method: 'express',
                    address: {
                        line1: '456 Maple Avenue',
                        city: 'Toronto',
                        state: 'ON',
                        country: 'Canada',
                        postalCode: 'M5V 2A8'
                    },
                    status: 'delivered',
                    trackingNumber: 'TRK789456789',
                    estimatedDelivery: new Date('2024-01-28'),
                    actualDelivery: new Date('2024-01-27')
                }
            },
            {
                id: 'o20002',
                date: new Date('2024-03-05T13:20:00Z'),
                items: [
                    {
                        productId: 'p8003',
                        name: 'Cordless Drill Set',
                        category: ['tools', 'power-tools'],
                        quantity: 1,
                        unitPrice: 199.99,
                        discount: 30,
                        specifications: {
                            brand: 'DeWalt',
                            voltage: '20V',
                            includes: 'case, charger, 2 batteries'
                        }
                    },
                    {
                        productId: 'p8004',
                        name: 'Tool Box',
                        category: ['tools', 'storage'],
                        quantity: 1,
                        unitPrice: 49.99,
                        specifications: {
                            material: 'plastic',
                            size: 'medium',
                            compartments: 12
                        }
                    }
                ],
                payment: {
                    method: 'credit',
                    total: 219.98,
                    currency: 'CAD',
                    status: 'completed',
                    transactionId: 't300146'
                },
                shipping: {
                    method: 'standard',
                    address: {
                        line1: '456 Maple Avenue',
                        city: 'Toronto',
                        state: 'ON',
                        country: 'Canada',
                        postalCode: 'M5V 2A8'
                    },
                    status: 'returned',
                    trackingNumber: 'TRK789456790',
                    estimatedDelivery: new Date('2024-03-10'),
                    actualDelivery: new Date('2024-03-09'),
                    returnRequested: true,
                    returnReason: 'Drill was defective'
                }
            },
            {
                id: 'o20003',
                date: new Date('2024-03-20T10:00:00Z'),
                items: [
                    {
                        productId: 'p8003',
                        name: 'Cordless Drill Set',
                        category: ['tools', 'power-tools'],
                        quantity: 1,
                        unitPrice: 199.99,
                        specifications: {
                            brand: 'DeWalt',
                            voltage: '20V',
                            includes: 'case, charger, 2 batteries'
                        }
                    }
                ],
                payment: {
                    method: 'credit',
                    total: 199.99,
                    currency: 'CAD',
                    status: 'completed',
                    transactionId: 't300147'
                },
                shipping: {
                    method: 'express',
                    address: {
                        line1: '456 Maple Avenue',
                        city: 'Toronto',
                        state: 'ON',
                        country: 'Canada',
                        postalCode: 'M5V 2A8'
                    },
                    status: 'delivered',
                    trackingNumber: 'TRK789456791',
                    estimatedDelivery: new Date('2024-03-23'),
                    actualDelivery: new Date('2024-03-22')
                }
            }
        ],
        activities: [
            {
                type: 'search',
                timestamp: new Date('2024-04-05T10:20:00Z'),
                details: {
                    searchQuery: 'fishing gear',
                    deviceInfo: {
                        type: 'desktop',
                        browser: 'Firefox',
                        os: 'Windows 11'
                    },
                    duration: 340
                }
            },
            {
                type: 'view',
                timestamp: new Date('2024-04-05T10:25:00Z'),
                details: {
                    productId: 'p8010',
                    productName: 'Professional Fishing Rod',
                    pageUrl: '/products/professional-fishing-rod',
                    deviceInfo: {
                        type: 'desktop',
                        browser: 'Firefox',
                        os: 'Windows 11'
                    },
                    duration: 180
                }
            },
            {
                type: 'wishlist',
                timestamp: new Date('2024-04-05T10:28:00Z'),
                details: {
                    productId: 'p8010',
                    productName: 'Professional Fishing Rod',
                    deviceInfo: {
                        type: 'desktop',
                        browser: 'Firefox',
                        os: 'Windows 11'
                    }
                }
            }
        ]
    },
    {
        id: 'c1003',
        name: 'Carol Martinez',
        email: 'c.martinez@example.com',
        registeredAt: new Date('2023-08-25T13:15:00Z'),
        demographics: {
            age: 29,
            gender: 'female',
            location: {
                country: 'USA',
                city: 'Austin',
                postalCode: '78701',
                coordinates: {
                    latitude: 30.2672,
                    longitude: -97.7431
                }
            },
            preferences: {
                categories: ['beauty', 'fashion', 'home-decor'],
                brands: ['Sephora', 'Zara', 'H&M'],
                priceRange: {
                    min: 30,
                    max: 300
                },
                notifications: {
                    email: true,
                    sms: true,
                    push: true,
                    frequency: 'weekly'
                }
            }
        },
        membership: {
            tier: 'silver',
            points: 2800,
            since: new Date('2023-08-25'),
            benefits: ['free-shipping', 'birthday-gift'],
            paymentMethods: [
                {
                    type: 'paypal',
                    isDefault: true,
                    billingAddress: {
                        line1: '789 Oak Street',
                        line2: 'Apt 303',
                        city: 'Austin',
                        state: 'TX',
                        country: 'USA',
                        postalCode: '78701'
                    }
                },
                {
                    type: 'debit',
                    isDefault: false,
                    lastDigits: '1234',
                    expiryDate: new Date('2026-04-01'),
                    billingAddress: {
                        line1: '789 Oak Street',
                        line2: 'Apt 303',
                        city: 'Austin',
                        state: 'TX',
                        country: 'USA',
                        postalCode: '78701'
                    }
                }
            ]
        },
        orderHistory: [
            {
                id: 'o30001',
                date: new Date('2024-02-05T16:40:00Z'),
                items: [
                    {
                        productId: 'p3001',
                        name: 'Premium Lipstick Set',
                        category: ['beauty', 'makeup'],
                        quantity: 1,
                        unitPrice: 45.99,
                        specifications: {
                            brand: 'Sephora',
                            shades: 'assorted',
                            organic: true
                        },
                        ratings: {
                            overall: 4.6,
                            aspects: {
                                quality: 4.8,
                                value: 4.2,
                                delivery: 5
                            }
                        }
                    },
                    {
                        productId: 'p3002',
                        name: 'Facial Serum',
                        category: ['beauty', 'skincare'],
                        quantity: 2,
                        unitPrice: 29.99,
                        specifications: {
                            brand: 'Natura',
                            volume: '30ml',
                            skinType: 'all types'
                        }
                    }
                ],
                payment: {
                    method: 'paypal',
                    total: 105.97,
                    currency: 'USD',
                    status: 'completed',
                    transactionId: 't500145'
                },
                shipping: {
                    method: 'standard',
                    address: {
                        line1: '789 Oak Street',
                        line2: 'Apt 303',
                        city: 'Austin',
                        state: 'TX',
                        country: 'USA',
                        postalCode: '78701'
                    },
                    status: 'delivered',
                    trackingNumber: 'TRK123789456',
                    estimatedDelivery: new Date('2024-02-10'),
                    actualDelivery: new Date('2024-02-09')
                }
            }
        ],
        activities: [
            {
                type: 'view',
                timestamp: new Date('2024-04-12T09:15:00Z'),
                details: {
                    productId: 'p3005',
                    productName: 'Designer Dress',
                    pageUrl: '/products/designer-dress',
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Chrome',
                        os: 'Android 12'
                    },
                    duration: 240
                }
            },
            {
                type: 'view',
                timestamp: new Date('2024-04-12T09:20:00Z'),
                details: {
                    productId: 'p3006',
                    productName: 'Designer Handbag',
                    pageUrl: '/products/designer-handbag',
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Chrome',
                        os: 'Android 12'
                    },
                    duration: 180
                }
            },
            {
                type: 'cart',
                timestamp: new Date('2024-04-12T09:25:00Z'),
                details: {
                    productId: 'p3006',
                    productName: 'Designer Handbag',
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Chrome',
                        os: 'Android 12'
                    }
                }
            },
            {
                type: 'referral',
                timestamp: new Date('2024-04-13T14:30:00Z'),
                details: {
                    referralSource: 'instagram',
                    campaign: 'spring_collection_2024',
                    deviceInfo: {
                        type: 'mobile',
                        browser: 'Chrome',
                        os: 'Android 12'
                    }
                }
            }
        ]
    }
];

// Export the function that runs examples
export function runEcommerceAnalytics() {
    console.log('\n----- E-commerce Analytics Examples -----\n');

    // Example 1: Get flat keys to explore the data structure
    console.log('Available paths in Customer data:');
    const sampleCustomer = customers[0];
    const paths = getFlatKeys(sampleCustomer);
    // Just display a few paths to avoid cluttering the console
    console.log(paths.slice(0, 10), '... and', paths.length - 10, 'more paths');

    // Example 2: High-value customers (platinum tier with over 10000 points)
    console.time('High-value customers:');
    const highValueCustomers = filterData(customers, {
        'membership.tier': 'platinum',
        'membership.points': { $gte: 10000 }
    });
    console.timeEnd('High-value customers:');
    console.log(highValueCustomers.map(c => ({
        id: c.id,
        name: c.name,
        points: c.membership.points
    })));

    // Example 3: Find products with high ratings in orders
    console.time('High rated products:');
    const highRatedProducts = new QueryBuilder<Customer>()
        .where('orderHistory', {
            $elemMatch: {
                items: {
                    $elemMatch: {
                        'ratings.overall': { $gte: 4.5 } as any // Use type assertion to simplify type inference
                    }
                }
            }
        })
        .select({
            customerId: 'id',
            customerName: 'name',
            highRatedItems: ['orderHistory.items', item =>
                item.ratings?.overall >= 4.5 ? {
                    productName: item.name,
                    rating: item.ratings.overall,
                    review: item.ratings.review?.text
                } : null
            ]
        })
        .filter(customers);
    console.timeEnd('High rated products:');
    console.log(JSON.stringify(highRatedProducts, null, 2));

    // Example 4: Complex filtering with nested arrays and conditions
    console.time('Recent mobile shoppers with specific activity patterns:');
    const recentMobileShoppers = new QueryBuilder<Customer>()
        .where('activities', {
            $elemMatch: {
                type: { $in: ['view', 'cart'] },
                timestamp: { $gt: new Date('2024-04-01') },
                'details.deviceInfo.type': 'mobile'
            }
        })
        .and([
            { 'demographics.preferences.notifications.push': true },
            { 'membership.tier': { $in: ['gold', 'platinum', 'silver'] } }
        ])
        .sort('registeredAt', 'desc')
        .filter(customers);
    console.timeEnd('Recent mobile shoppers with specific activity patterns:');
    console.log(recentMobileShoppers.map(c => ({
        id: c.id,
        name: c.name,
        tier: c.membership.tier,
        mobileActivities: c.activities.filter(a =>
            a.details.deviceInfo?.type === 'mobile' &&
            new Date(a.timestamp) > new Date('2024-04-01')
        ).length
    })));

    // Example 5: Geographic analysis
    console.time('US-based customers by states:');
    const usCustomersByState = new QueryBuilder<Customer>()
        .where('demographics.location.country', 'USA')
        .select({
            id: 'id',
            name: 'name',
            state: 'demographics.location.city',
            membershipTier: 'membership.tier'
        })
        .filter(customers);
    console.timeEnd('US-based customers by states:');
    console.log(usCustomersByState);

    // Example 6: Return request analysis
    console.time('Customers with returned orders:');
    const customersWithReturns = new QueryBuilder<Customer>()
        .where('orderHistory', {
            $elemMatch: {
                'shipping.status': 'returned'
            }
        })
        .select({
            customerId: 'id',
            customerName: 'name',
            membershipTier: 'membership.tier',
            returnedOrders: ['orderHistory', order =>
                order.shipping.status === 'returned' ? {
                    orderId: order.id,
                    date: order.date,
                    items: order.items.map(item => item.name),
                    returnReason: order.shipping.returnReason
                } : null
            ]
        })
        .filter(customers);
    console.timeEnd('Customers with returned orders:');
    console.log(JSON.stringify(customersWithReturns, null, 2));

    // Example 7: Advanced purchase analysis with aggregation through custom function
    console.time('Customer spending analysis:');
    const spendingAnalysis = new QueryBuilder<Customer>()
        .select(customer => {
            // Calculate total spending
            const totalSpent = customer.orderHistory.reduce((sum, order) =>
                sum + order.payment.total, 0);

            // Calculate items per category
            const categoryPurchases: Record<string, number> = {};
            customer.orderHistory.forEach(order => {
                order.items.forEach(item => {
                    item.category.forEach(cat => {
                        categoryPurchases[cat] = (categoryPurchases[cat] || 0) + 1;
                    });
                });
            });

            // Top category by number of items
            let topCategory = '';
            let maxItems = 0;
            Object.entries(categoryPurchases).forEach(([cat, count]) => {
                if (count > maxItems) {
                    maxItems = count;
                    topCategory = cat;
                }
            });

            return {
                id: customer.id,
                name: customer.name,
                memberSince: customer.membership.since.toISOString().split('T')[0],
                tier: customer.membership.tier,
                totalSpent: totalSpent.toFixed(2),
                orderCount: customer.orderHistory.length,
                preferredPaymentMethod: customer.membership.paymentMethods?.find(m => m.isDefault)?.type || 'unknown',
                topCategory,
                avgOrderValue: (totalSpent / customer.orderHistory.length).toFixed(2)
            };
        })
        .filter(customers);
    console.timeEnd('Customer spending analysis:');
    console.log(JSON.stringify(spendingAnalysis, null, 2));

    // Example 8: Using $or with deep nested conditions
    console.time('Mobile or high-spending customers:');
    const mobileOrHighSpendingCustomers = new QueryBuilder<Customer>()
        .or([
            { 'activities.details.deviceInfo.type': 'mobile' },
            {
                $where: (customer: { orderHistory: any[]; }) => {
                    const totalSpent = customer.orderHistory.reduce((sum, order) =>
                        sum + order.payment.total, 0);
                    return totalSpent > 200;
                }
            }
        ])
        .filter(customers);
    console.timeEnd('Mobile or high-spending customers:');
    console.log(mobileOrHighSpendingCustomers.map(c => ({
        id: c.id,
        name: c.name,
        usesMobile: c.activities.some(a => a.details.deviceInfo?.type === 'mobile'),
        totalSpent: c.orderHistory.reduce((sum, order) => sum + order.payment.total, 0).toFixed(2)
    })));
}
