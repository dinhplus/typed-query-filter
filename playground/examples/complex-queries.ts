import { QueryBuilder, filterData, getFlatKeys } from '../../src';

// Định nghĩa một cấu trúc dữ liệu phức tạp
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    categories: string[];
    isAvailable: boolean;
    stats: {
        rating: number;
        reviews: number;
        views: number;
    };
    variants: {
        sku: string;
        color: string;
        size?: string;
        stock: number;
        price: number;
        images: string[];
        promotion?: {
            discount?: number;
            validUntil?: Date;
            couponCodes?: string[];
        };
        specifications: Record<string, string | number>;
    }[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        lastPurchase?: Date;
        supplier: {
            id: string;
            name: string;
            contact: {
                email: string;
                phone?: string;
                address: {
                    street: string;
                    city: string;
                    country: string;
                    zipCode?: string;
                };
            };
            rating: number;
            tags: string[];
        };
    };
    relatedProducts?: string[];
}

// Tạo dữ liệu mẫu
const products: Product[] = [
    {
        id: 'p001',
        name: 'Professional Camera',
        price: 1299.99,
        description: 'High-end professional camera with advanced features',
        categories: ['electronics', 'photography', 'professional'],
        isAvailable: true,
        stats: {
            rating: 4.8,
            reviews: 258,
            views: 15420
        },
        variants: [
            {
                sku: 'CAM-BLK-PRO',
                color: 'Black',
                stock: 15,
                price: 1299.99,
                images: ['cam_black_1.jpg', 'cam_black_2.jpg'],
                promotion: {
                    discount: 10,
                    validUntil: new Date('2025-06-30'),
                    couponCodes: ['SUMMER10', 'PHOTO25']
                },
                specifications: {
                    weight: '890g',
                    dimensions: '5.5 x 4.1 x 3.0 inches',
                    sensor: 'CMOS',
                    resolution: '24MP'
                }
            },
            {
                sku: 'CAM-SLV-PRO',
                color: 'Silver',
                stock: 8,
                price: 1399.99,
                images: ['cam_silver_1.jpg', 'cam_silver_2.jpg'],
                promotion: {
                    discount: 5,
                    validUntil: new Date('2025-05-15')
                },
                specifications: {
                    weight: '890g',
                    dimensions: '5.5 x 4.1 x 3.0 inches',
                    sensor: 'CMOS',
                    resolution: '24MP'
                }
            }
        ],
        metadata: {
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-03-20'),
            lastPurchase: new Date('2024-04-05'),
            supplier: {
                id: 'sup123',
                name: 'OptiTech Electronics',
                contact: {
                    email: 'supply@optitech.com',
                    phone: '+1-555-2340',
                    address: {
                        street: '789 Innovation Drive',
                        city: 'San Francisco',
                        country: 'USA',
                        zipCode: '94107'
                    }
                },
                rating: 4.9,
                tags: ['electronics', 'reliable', 'premium']
            }
        },
        relatedProducts: ['p002', 'p005', 'p010']
    },
    {
        id: 'p002',
        name: 'Camera Lens 50mm',
        price: 349.99,
        description: 'Professional grade 50mm lens with f/1.4 aperture',
        categories: ['electronics', 'photography', 'accessories'],
        isAvailable: true,
        stats: {
            rating: 4.7,
            reviews: 180,
            views: 8900
        },
        variants: [
            {
                sku: 'LENS-50-BLK',
                color: 'Black',
                stock: 22,
                price: 349.99,
                images: ['lens_50mm_1.jpg', 'lens_50mm_2.jpg'],
                specifications: {
                    weight: '320g',
                    dimensions: '2.9 x 2.9 x 2.1 inches',
                    focalLength: '50mm',
                    maxAperture: 'f/1.4'
                }
            }
        ],
        metadata: {
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-03-15'),
            lastPurchase: new Date('2024-04-12'),
            supplier: {
                id: 'sup123',
                name: 'OptiTech Electronics',
                contact: {
                    email: 'supply@optitech.com',
                    phone: '+1-555-2340',
                    address: {
                        street: '789 Innovation Drive',
                        city: 'San Francisco',
                        country: 'USA',
                        zipCode: '94107'
                    }
                },
                rating: 4.9,
                tags: ['electronics', 'reliable', 'premium']
            }
        },
        relatedProducts: ['p001', 'p003']
    },
    {
        id: 'p003',
        name: 'Tripod Stand',
        price: 79.99,
        description: 'Sturdy aluminum tripod stand for cameras and smartphones',
        categories: ['photography', 'accessories', 'budget-friendly'],
        isAvailable: true,
        stats: {
            rating: 4.5,
            reviews: 320,
            views: 12200
        },
        variants: [
            {
                sku: 'TRP-BLK-STD',
                color: 'Black',
                stock: 45,
                price: 79.99,
                images: ['tripod_black.jpg'],
                specifications: {
                    weight: '1.2kg',
                    maxHeight: '170cm',
                    material: 'Aluminum'
                }
            },
            {
                sku: 'TRP-RED-STD',
                color: 'Red',
                stock: 0,
                price: 79.99,
                images: ['tripod_red.jpg'],
                specifications: {
                    weight: '1.2kg',
                    maxHeight: '170cm',
                    material: 'Aluminum'
                }
            }
        ],
        metadata: {
            createdAt: new Date('2023-11-10'),
            updatedAt: new Date('2024-02-05'),
            lastPurchase: new Date('2024-04-10'),
            supplier: {
                id: 'sup456',
                name: 'PhotoGear Inc',
                contact: {
                    email: 'contact@photogear.com',
                    address: {
                        street: '456 Camera Street',
                        city: 'New York',
                        country: 'USA',
                        zipCode: '10001'
                    }
                },
                rating: 4.3,
                tags: ['accessories', 'budget']
            }
        },
        relatedProducts: ['p001', 'p002', 'p004']
    },
    {
        id: 'p004',
        name: 'Camera Backpack',
        price: 129.99,
        description: 'Waterproof camera backpack with customizable compartments',
        categories: ['photography', 'accessories', 'bags'],
        isAvailable: false,
        stats: {
            rating: 4.6,
            reviews: 95,
            views: 5400
        },
        variants: [
            {
                sku: 'BAG-BLK-CAM',
                color: 'Black',
                stock: 0,
                price: 129.99,
                images: ['backpack_black.jpg', 'backpack_black_inside.jpg'],
                specifications: {
                    capacity: '20L',
                    material: 'Nylon, waterproof',
                    compartments: 6
                }
            }
        ],
        metadata: {
            createdAt: new Date('2023-12-05'),
            updatedAt: new Date('2024-03-01'),
            supplier: {
                id: 'sup789',
                name: 'CarryAll',
                contact: {
                    email: 'support@carryall.com',
                    phone: '+1-555-6789',
                    address: {
                        street: '123 Bag Avenue',
                        city: 'Portland',
                        country: 'USA'
                    }
                },
                rating: 4.2,
                tags: ['bags', 'accessories']
            }
        }
    },
    {
        id: 'p005',
        name: 'Ultra HD 4K Action Camera',
        price: 249.99,
        description: 'Compact waterproof 4K action camera for extreme sports',
        categories: ['electronics', 'photography', 'sports'],
        isAvailable: true,
        stats: {
            rating: 4.4,
            reviews: 210,
            views: 9800
        },
        variants: [
            {
                sku: 'ACT-BLK-4K',
                color: 'Black',
                stock: 30,
                price: 249.99,
                images: ['action_cam_black.jpg'],
                promotion: {
                    discount: 15,
                    validUntil: new Date('2025-05-30')
                },
                specifications: {
                    weight: '75g',
                    resolution: '4K',
                    waterproof: 'Up to 30m',
                    battery: '2h recording time'
                }
            },
            {
                sku: 'ACT-SLV-4K',
                color: 'Silver',
                stock: 0,
                price: 249.99,
                images: ['action_cam_silver.jpg'],
                specifications: {
                    weight: '75g',
                    resolution: '4K',
                    waterproof: 'Up to 30m',
                    battery: '2h recording time'
                }
            },
            {
                sku: 'ACT-BLU-4K',
                color: 'Blue',
                stock: 12,
                price: 269.99,
                images: ['action_cam_blue.jpg'],
                specifications: {
                    weight: '75g',
                    resolution: '4K',
                    waterproof: 'Up to 30m',
                    battery: '2h recording time'
                }
            }
        ],
        metadata: {
            createdAt: new Date('2023-10-25'),
            updatedAt: new Date('2024-02-15'),
            lastPurchase: new Date('2024-03-28'),
            supplier: {
                id: 'sup123',
                name: 'OptiTech Electronics',
                contact: {
                    email: 'supply@optitech.com',
                    phone: '+1-555-2340',
                    address: {
                        street: '789 Innovation Drive',
                        city: 'San Francisco',
                        country: 'USA',
                        zipCode: '94107'
                    }
                },
                rating: 4.9,
                tags: ['electronics', 'reliable', 'premium']
            }
        },
        relatedProducts: ['p001', 'p003']
    }
];

export function runComplexQueries() {
    console.log('\n----- Complex Queries Examples -----\n');

    // Test 1: Using FlatKey to get all possible paths
    console.log('Available paths in Product type:');
    const sampleProduct = products[0];
    const paths = getFlatKeys(sampleProduct);
    console.log(paths);

    // Test 2: Filter products with nested array conditions
    console.time('Products with black variants in stock:');
    const blackProductsInStock = filterData(products, {
        variants: {
            $elemMatch: {
                color: 'Black',
                stock: { $gt: 0 }
            }
        }
    });
    console.timeEnd('Products with black variants in stock:');
    console.log(blackProductsInStock.map(p => ({ id: p.id, name: p.name })));

    // Test 3: Filter with multiple complex conditions
    console.time('Complex filtering:');
    const complexFilter = new QueryBuilder<Product>()
        .where('price', { $lt: 500 })
        .where('categories', { $some: ['photography'] })
        .where('stats.rating', { $gte: 4.5 })
        .where('variants', {
            $elemMatch: {
                'promotion.discount': { $exists: true }
            } as any
        })
        .sort('price', 'desc')
        .limit(3)
        .filter(products);
    console.timeEnd('Complex filtering:');
    console.log(complexFilter.map(p => ({ id: p.id, name: p.name, price: p.price })));

    // Test 4: Advanced projection with nested template
    console.time('Advanced projection:');
    const projectedResults = new QueryBuilder<Product>()
        .where('isAvailable', true)
        .select({
            productId: 'id',
            productName: 'name',
            priceInfo: {
                basePrice: 'price',
                currency: 'USD'
            },
            supplierDetails: {
                name: 'metadata.supplier.name',
                location: 'metadata.supplier.contact.address.city',
                rating: 'metadata.supplier.rating'
            },
            variantsInfo: ['variants', {
                sku: 'sku',
                color: 'color',
                inStock: (variant) => variant.stock > 0,
                discountedPrice: (variant) => {
                    if (variant.promotion?.discount) {
                        return variant.price * (1 - variant.promotion.discount / 100);
                    }
                    return variant.price;
                },
                promoEnds: 'promotion.validUntil'
            }],
            popularityScore: (product) => {
                return (product.stats.rating * 20) + (product.stats.reviews / 10);
            }
        })
        .filter(products);
    console.timeEnd('Advanced projection:');
    console.log(JSON.stringify(projectedResults, null, 2));

    // Test 5: OR conditions with deep nesting
    console.time('OR conditions with deep nesting:');
    const orResults = new QueryBuilder<Product>()
        .or([
            { 'metadata.supplier.contact.address.city': 'San Francisco' },
            { 'variants.specifications.material': 'Aluminum' },
            {
                $and: [
                    { categories: { $some: ['electronics'] } },
                    { stats: { $elemMatch: { rating: { $gt: 4.7 } } } }
                ]
            }
        ])
        .filter(products);
    console.timeEnd('OR conditions with deep nesting:');
    console.log(orResults.map(p => ({ id: p.id, name: p.name })));

    // Test 6: Date-based queries
    console.time('Recent products updated in 2024:');
    const recentProducts = new QueryBuilder<Product>()
        .custom(product => {
            const updateDate = product.metadata.updatedAt;
            return updateDate.getFullYear() === 2024 && updateDate.getMonth() >= 2; // March or later
        })
        .sort('metadata.updatedAt', 'desc')
        .filter(products);
    console.timeEnd('Recent products updated in 2024:');
    console.log(recentProducts.map(p => ({
        id: p.id,
        name: p.name,
        updated: p.metadata.updatedAt.toISOString().split('T')[0]
    })));

    // Test 7: Inventory management query
    console.time('Low stock report:');
    const lowStockProducts = new QueryBuilder<Product>()
        .where('isAvailable', true)
        .where('variants', {
            $elemMatch: {
                stock: { $lt: 10, $gt: 0 }
            } as any
        })
        .select({
            productId: 'id',
            name: 'name',
            lowStockVariants: ['variants', (variant) =>
                variant.stock < 10 && variant.stock > 0
                    ? {
                        sku: variant.sku,
                        color: variant.color,
                        currentStock: variant.stock,
                        reorderStatus: 'NEEDED'
                    }
                    : null
            ]
        })
        .filter(products);
    console.timeEnd('Low stock report:');
    console.log(JSON.stringify(lowStockProducts, null, 2));

    // Test 8: Deep nested filtering and projection
    console.time('Deep nested filtering:');
    const deepNestedResults = new QueryBuilder<Product>()
        .where('metadata.supplier.tags', { $some: ['premium'] })
        .where('metadata.supplier.rating', { $gte: 4.8 })
        .sort('stats.reviews', 'desc')
        .select({
            name: 'name',
            supplierName: 'metadata.supplier.name',
            popularityMetrics: {
                reviewCount: 'stats.reviews',
                averageRating: 'stats.rating',
                totalViews: 'stats.views'
            },
            availableVariants: ['variants', (variant) =>
                variant.stock > 0
                    ? {
                        color: variant.color,
                        stockLevel: variant.stock > 20 ? 'High' : 'Medium',
                        hasPromotion: variant.promotion ? true : false
                    }
                    : null
            ]
        })
        .filter(products);
    console.timeEnd('Deep nested filtering:');
    console.log(JSON.stringify(deepNestedResults, null, 2));
}
