import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.cart.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.productCategory.create({ data: { name: 'Electronics' } }),
    prisma.productCategory.create({ data: { name: 'Clothing' } }),
    prisma.productCategory.create({ data: { name: 'Home & Kitchen' } }),
    prisma.productCategory.create({ data: { name: 'Sports & Outdoors' } }),
    prisma.productCategory.create({ data: { name: 'Books & Stationery' } }),
    prisma.productCategory.create({ data: { name: 'Food & Beverages' } }),
    prisma.productCategory.create({ data: { name: 'Health & Beauty' } }),
    prisma.productCategory.create({ data: { name: 'Toys & Games' } }),
    prisma.productCategory.create({ data: { name: 'Automotive' } }),
    prisma.productCategory.create({ data: { name: 'Garden & Tools' } }),
  ])

  console.log('Created categories:', categories.length)

  // Product data arrays for each category
  const electronicsProducts = [
    { name: 'MacBook Pro 14"', description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD', price: 1999, stock: 25 },
    { name: 'Sony WH-1000XM5', description: 'Wireless noise-canceling headphones', price: 349, stock: 48 },
    { name: 'Samsung Galaxy S24 Ultra', description: '256GB, Titanium Black', price: 1299, stock: 32 },
    { name: 'iPad Air 5th Gen', description: '10.9-inch, 256GB, Space Gray', price: 749, stock: 40 },
    { name: 'Dell XPS 15', description: 'Intel i7, 16GB RAM, 512GB SSD', price: 1499, stock: 18 },
    { name: 'Apple Watch Series 9', description: '45mm, GPS, Midnight', price: 429, stock: 55 },
    { name: 'Bose QuietComfort Ultra', description: 'Wireless noise-canceling earbuds', price: 299, stock: 62 },
    { name: 'LG OLED C3 65"', description: '4K Smart TV with AI', price: 1799, stock: 12 },
    { name: 'Canon EOS R6 Mark II', description: 'Full-frame mirrorless camera', price: 2499, stock: 8 },
    { name: 'Nintendo Switch OLED', description: 'White Joy-Con controllers', price: 349, stock: 75 },
    { name: 'PlayStation 5 Digital', description: 'Next-gen gaming console', price: 449, stock: 20 },
    { name: 'Xbox Series X', description: '1TB SSD gaming console', price: 499, stock: 15 },
    { name: 'AirPods Pro 2', description: 'Active noise cancellation', price: 249, stock: 95 },
    { name: 'Google Pixel 8 Pro', description: '256GB, Obsidian', price: 999, stock: 28 },
    { name: 'Sonos Era 300', description: 'Spatial audio smart speaker', price: 449, stock: 22 },
  ]

  const clothingProducts = [
    { name: 'Nike Air Max 90', description: 'Classic sneakers, multiple sizes', price: 130, stock: 85 },
    { name: "Levi's 501 Original Jeans", description: 'Classic fit, stonewash blue', price: 89, stock: 120 },
    { name: 'North Face Puffer Jacket', description: 'Waterproof, 700-fill down', price: 299, stock: 45 },
    { name: 'Adidas Ultraboost 23', description: 'Running shoes, cloud white', price: 190, stock: 68 },
    { name: 'Patagonia Better Sweater', description: 'Fleece jacket, navy blue', price: 139, stock: 52 },
    { name: 'Ralph Lauren Polo Shirt', description: 'Classic fit, white', price: 98, stock: 88 },
    { name: 'Canada Goose Expedition', description: 'Extreme cold parka', price: 1295, stock: 12 },
    { name: 'Allbirds Tree Runners', description: 'Sustainable sneakers', price: 98, stock: 75 },
    { name: 'Champion Reverse Weave Hoodie', description: 'Gray, cotton blend', price: 65, stock: 110 },
    { name: 'Dr. Martens 1460 Boots', description: 'Classic 8-eye boots, black', price: 180, stock: 42 },
    { name: 'Carhartt WIP Beanie', description: 'Acrylic watch hat', price: 25, stock: 200 },
    { name: 'Arc\'teryx Beta AR Jacket', description: 'Gore-Tex waterproof', price: 599, stock: 18 },
    { name: 'Uniqlo Ultra Light Down', description: 'Packable jacket', price: 79, stock: 95 },
    { name: 'Vans Old Skool', description: 'Classic skate shoe, black/white', price: 70, stock: 130 },
    { name: 'Columbia Fleece Vest', description: 'Lightweight, charcoal', price: 55, stock: 78 },
  ]

  const homeKitchenProducts = [
    { name: 'Dyson V15 Vacuum', description: 'Cordless stick vacuum with laser', price: 749, stock: 18 },
    { name: 'KitchenAid Stand Mixer', description: '5-quart, Empire Red', price: 449, stock: 22 },
    { name: 'Nespresso Vertuo Plus', description: 'Coffee and espresso machine', price: 189, stock: 55 },
    { name: 'Instant Pot Duo 7-in-1', description: '6-quart pressure cooker', price: 89, stock: 85 },
    { name: 'Vitamix E310', description: 'Professional-grade blender', price: 349, stock: 28 },
    { name: 'Le Creuset Dutch Oven', description: '5.5-quart, flame orange', price: 380, stock: 15 },
    { name: 'Roomba j7+', description: 'Self-emptying robot vacuum', price: 799, stock: 20 },
    { name: 'Breville Smart Oven', description: 'Convection toaster oven', price: 299, stock: 32 },
    { name: 'All-Clad D3 Cookware Set', description: '10-piece stainless steel', price: 699, stock: 10 },
    { name: 'Ninja Foodi Air Fryer', description: '6-in-1, 10-quart', price: 199, stock: 45 },
    { name: 'Philips Hue Starter Kit', description: 'Smart lighting system', price: 179, stock: 58 },
    { name: 'Casper Original Mattress', description: 'Queen size, medium-firm', price: 1095, stock: 8 },
    { name: 'Tempur-Pedic Pillow', description: 'Memory foam, standard', price: 89, stock: 72 },
    { name: 'Cuisinart Coffee Maker', description: '14-cup programmable', price: 99, stock: 65 },
    { name: 'Shark Navigator Lift-Away', description: 'Upright vacuum', price: 199, stock: 38 },
  ]

  const sportsProducts = [
    { name: 'Yeti Tundra 45 Cooler', description: 'Premium hard cooler, white', price: 325, stock: 30 },
    { name: 'Garmin Fenix 7X', description: 'Multisport GPS smartwatch', price: 899, stock: 15 },
    { name: 'Patagonia Nano Puff Vest', description: 'Lightweight insulated vest', price: 179, stock: 65 },
    { name: 'Hydro Flask 32oz', description: 'Insulated water bottle', price: 45, stock: 150 },
    { name: 'Theragun Elite', description: 'Percussive therapy device', price: 399, stock: 24 },
    { name: 'Peloton Bike+', description: 'Connected fitness bike', price: 2495, stock: 6 },
    { name: 'Bowflex Adjustable Dumbbells', description: '5-52.5 lbs pair', price: 429, stock: 18 },
    { name: 'Osprey Atmos AG 65', description: 'Backpacking pack', price: 280, stock: 22 },
    { name: 'Black Diamond Headlamp', description: 'Spot 400 rechargeable', price: 50, stock: 88 },
    { name: 'GoPro Hero 12 Black', description: '5.3K action camera', price: 399, stock: 35 },
    { name: 'Traeger Pro 575 Grill', description: 'Wood pellet smoker', price: 799, stock: 10 },
    { name: 'Fitbit Charge 6', description: 'Advanced fitness tracker', price: 159, stock: 62 },
    { name: 'REI Co-op Flash 55 Pack', description: 'Ultralight backpack', price: 199, stock: 28 },
    { name: 'Coleman 8-Person Tent', description: 'Instant cabin tent', price: 249, stock: 16 },
    { name: 'Yeti Rambler 20oz', description: 'Insulated tumbler', price: 35, stock: 180 },
  ]

  const booksProducts = [
    { name: 'Moleskine Classic Notebook', description: 'Large, ruled, black hardcover', price: 24, stock: 200 },
    { name: 'Kindle Paperwhite', description: '6.8" display, 16GB, without ads', price: 149, stock: 75 },
    { name: 'Lamy Safari Fountain Pen', description: 'Medium nib, charcoal black', price: 38, stock: 90 },
    { name: 'Pilot G2 Gel Pens 12-Pack', description: 'Fine point, assorted colors', price: 15, stock: 250 },
    { name: 'Leuchtturm1917 Bullet Journal', description: 'Dotted, A5, black', price: 28, stock: 115 },
    { name: 'Tombow Dual Brush Pens', description: '10-pack, primary colors', price: 32, stock: 95 },
    { name: 'Remarkable 2 Tablet', description: 'E-ink writing tablet', price: 449, stock: 22 },
    { name: 'Staedtler Pencil Set', description: 'Drawing pencils, 12 grades', price: 18, stock: 140 },
    { name: 'Rhodia Dotpad A4', description: 'Premium dot grid paper', price: 12, stock: 185 },
    { name: 'Pentel EnerGel Pens', description: '0.7mm, black, 6-pack', price: 14, stock: 165 },
    { name: 'Hobonichi Techo Planner', description: 'A6, Japanese daily planner', price: 42, stock: 55 },
    { name: 'Copic Sketch Markers', description: '12-piece basic set', price: 78, stock: 38 },
    { name: 'Faber-Castell Polychromos', description: '24 color pencils', price: 52, stock: 48 },
    { name: 'Midori Traveler\'s Notebook', description: 'Regular size, camel leather', price: 65, stock: 32 },
    { name: 'Baron Fig Confidant', description: 'Hardcover notebook, charcoal', price: 22, stock: 88 },
  ]

  const foodProducts = [
    { name: 'Nespresso Vertuo Capsules', description: '30 count variety pack', price: 42, stock: 120 },
    { name: 'Ghirardelli Chocolate Squares', description: 'Premium assortment, 15.6oz', price: 18, stock: 95 },
    { name: 'Blue Bottle Coffee Beans', description: 'Three Africas Blend, 12oz', price: 22, stock: 68 },
    { name: 'Manuka Honey MGO 400+', description: '8.8oz jar, raw honey', price: 65, stock: 35 },
    { name: 'Olive Oil Extra Virgin', description: 'California Olive Ranch, 25oz', price: 18, stock: 145 },
    { name: 'Himalayan Pink Salt', description: 'Fine grain, 2.2 lbs', price: 12, stock: 180 },
    { name: 'Matcha Green Tea Powder', description: 'Ceremonial grade, 30g', price: 35, stock: 55 },
    { name: 'Almonds Dry Roasted', description: 'Blue Diamond, 25oz', price: 16, stock: 88 },
    { name: 'Coconut Oil Organic', description: 'Viva Naturals, 16oz', price: 14, stock: 125 },
    { name: 'Protein Powder Whey', description: 'Optimum Nutrition, 5lbs', price: 62, stock: 48 },
    { name: 'Green Tea Variety Pack', description: 'Tazo, 40 tea bags', price: 12, stock: 155 },
    { name: 'Maple Syrup Grade A', description: 'Vermont pure, 32oz', price: 28, stock: 62 },
    { name: 'Quinoa Organic', description: 'Bob\'s Red Mill, 26oz', price: 9, stock: 195 },
    { name: 'Dark Chocolate Bar 85%', description: 'Lindt Excellence, 3.5oz', price: 5, stock: 220 },
    { name: 'Avocado Oil Spray', description: 'Chosen Foods, 13.5oz', price: 11, stock: 135 },
  ]

  const healthProducts = [
    { name: 'Vitamin D3 5000 IU', description: 'Nature Made, 220 softgels', price: 18, stock: 145 },
    { name: 'Dyson Airwrap Complete', description: 'Hair styling system', price: 599, stock: 15 },
    { name: 'Olaplex No. 3 Treatment', description: 'Hair perfector, 3.3oz', price: 30, stock: 78 },
    { name: 'CeraVe Moisturizing Cream', description: '19oz pump jar', price: 19, stock: 165 },
    { name: 'Oral-B iO Series 9', description: 'Electric toothbrush', price: 299, stock: 28 },
    { name: 'Revlon One-Step Hair Dryer', description: 'Volumizer brush', price: 59, stock: 85 },
    { name: 'La Roche-Posay Sunscreen', description: 'Anthelios SPF 60, 1.7oz', price: 35, stock: 95 },
    { name: 'Neutrogena Hydro Boost', description: 'Water gel moisturizer', price: 24, stock: 125 },
    { name: 'Philips Sonicare 4100', description: 'Electric toothbrush', price: 49, stock: 72 },
    { name: 'The Ordinary Niacinamide', description: '10% + Zinc 1%, 30ml', price: 12, stock: 188 },
    { name: 'Bioderma Micellar Water', description: 'Sensibio H2O, 16.7oz', price: 18, stock: 105 },
    { name: 'Drunk Elephant C-Firma', description: 'Vitamin C serum, 1oz', price: 80, stock: 32 },
    { name: 'Waterpik Water Flosser', description: 'Aquarius Professional', price: 79, stock: 45 },
    { name: 'First Aid Beauty Cream', description: 'Ultra repair, 6oz', price: 38, stock: 68 },
    { name: 'Paula\'s Choice BHA Exfoliant', description: '2% salicylic acid, 4oz', price: 34, stock: 82 },
  ]

  const toysProducts = [
    { name: 'LEGO Star Wars Millennium Falcon', description: '1351 pieces, ages 9+', price: 169, stock: 28 },
    { name: 'Nintendo Switch Lite', description: 'Turquoise handheld console', price: 199, stock: 45 },
    { name: 'Barbie Dreamhouse', description: '3-story, 10 rooms', price: 199, stock: 22 },
    { name: 'Hot Wheels Ultimate Garage', description: 'Stores 100+ cars', price: 159, stock: 18 },
    { name: 'Play-Doh Mega Pack', description: '36 cans, assorted colors', price: 25, stock: 95 },
    { name: 'Monopoly Classic Edition', description: 'Family board game', price: 22, stock: 120 },
    { name: 'Nerf Elite 2.0 Commander', description: 'Motorized blaster', price: 35, stock: 65 },
    { name: 'Pokemon Trading Cards Booster', description: 'Elite trainer box', price: 49, stock: 55 },
    { name: 'Catan Board Game', description: 'Strategy game, 3-4 players', price: 44, stock: 42 },
    { name: 'Magna-Tiles Clear Colors', description: '100-piece set', price: 119, stock: 32 },
    { name: 'VTech KidiZoom Camera', description: 'Kids digital camera', price: 49, stock: 58 },
    { name: 'Melissa & Doug Puzzles', description: 'Wooden jigsaw set, 4-pack', price: 28, stock: 85 },
    { name: 'UNO Card Game', description: 'Classic card game', price: 8, stock: 250 },
    { name: 'Beyblade Burst Stadium', description: 'Battle set with launchers', price: 45, stock: 38 },
    { name: 'Ravensburger 1000pc Puzzle', description: 'European landscape', price: 18, stock: 72 },
  ]

  const automotiveProducts = [
    { name: 'Chemical Guys Wash Kit', description: 'Car wash essentials, 16-piece', price: 89, stock: 45 },
    { name: 'Armor All Tire Foam', description: 'Tire protectant, 20oz', price: 12, stock: 165 },
    { name: 'Dash Cam Vantrue N4', description: '3-channel 4K recording', price: 299, stock: 22 },
    { name: 'Jump Starter NOCO GB40', description: '1000A portable charger', price: 99, stock: 55 },
    { name: 'Floor Mats WeatherTech', description: 'Universal fit, black', price: 159, stock: 35 },
    { name: 'Car Vacuum BLACK+DECKER', description: 'Dustbuster handheld', price: 49, stock: 72 },
    { name: 'Air Freshener Little Trees', description: '24-pack, new car scent', price: 15, stock: 195 },
    { name: 'Michelin Wiper Blades', description: 'Stealth Ultra, 22 inch', price: 28, stock: 88 },
    { name: 'LED Headlight Bulbs', description: 'AUXITO H11, 6500K white', price: 45, stock: 62 },
    { name: 'Seat Covers Full Set', description: 'FH Group, black/gray', price: 69, stock: 38 },
    { name: 'Car Phone Mount', description: 'iOttie Easy One Touch', price: 25, stock: 145 },
    { name: 'Tire Pressure Gauge', description: 'AstroAI digital, backlit', price: 14, stock: 185 },
    { name: 'Portable Air Compressor', description: 'EPAuto 12V DC inflator', price: 35, stock: 75 },
    { name: 'Car Wax Meguiar\'s Gold', description: 'Premium paste, 11oz', price: 22, stock: 95 },
    { name: 'Sunshade Windshield', description: 'EcoNour, universal fit', price: 18, stock: 125 },
  ]

  const gardenProducts = [
    { name: 'Dewalt Drill 20V MAX', description: 'Cordless with battery', price: 149, stock: 42 },
    { name: 'Fiskars Pruning Shears', description: 'Bypass pruner, steel', price: 18, stock: 125 },
    { name: 'Weber Spirit II Grill', description: '3-burner propane, black', price: 499, stock: 12 },
    { name: 'Milwaukee Tool Set', description: '250-piece mechanics set', price: 299, stock: 18 },
    { name: 'Stanley Socket Set', description: '123-piece, chrome', price: 79, stock: 55 },
    { name: 'Craftsman Toolbox', description: '26-inch rolling chest', price: 249, stock: 22 },
    { name: 'Miracle-Gro Potting Mix', description: '2 cu ft bag', price: 18, stock: 145 },
    { name: 'Greenworks Lawn Mower', description: '40V cordless, 21-inch', price: 349, stock: 15 },
    { name: 'Garden Hose Flexzilla', description: '100 ft, flexible', price: 89, stock: 48 },
    { name: 'Scotts Turf Builder', description: 'Lawn food, 15000 sq ft', price: 55, stock: 65 },
    { name: 'Sun Joe Pressure Washer', description: '2030 PSI electric', price: 169, stock: 28 },
    { name: 'Bosch Rotary Hammer', description: 'SDS-Plus, 1-inch', price: 189, stock: 18 },
    { name: 'Keter Outdoor Storage', description: 'Resin deck box, 120 gal', price: 149, stock: 22 },
    { name: 'Black+Decker Hedge Trimmer', description: '22-inch cordless', price: 89, stock: 35 },
    { name: 'Husqvarna Chainsaw', description: '18-inch gas powered', price: 359, stock: 10 },
  ]

  // Helper to get random date in 2024
  const getRandomDate = () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-04-15')
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  // Create all products
  const allProductsData = [
    ...electronicsProducts.map(p => ({ ...p, productCategoryId: categories[0].id })),
    ...clothingProducts.map(p => ({ ...p, productCategoryId: categories[1].id })),
    ...homeKitchenProducts.map(p => ({ ...p, productCategoryId: categories[2].id })),
    ...sportsProducts.map(p => ({ ...p, productCategoryId: categories[3].id })),
    ...booksProducts.map(p => ({ ...p, productCategoryId: categories[4].id })),
    ...foodProducts.map(p => ({ ...p, productCategoryId: categories[5].id })),
    ...healthProducts.map(p => ({ ...p, productCategoryId: categories[6].id })),
    ...toysProducts.map(p => ({ ...p, productCategoryId: categories[7].id })),
    ...automotiveProducts.map(p => ({ ...p, productCategoryId: categories[8].id })),
    ...gardenProducts.map(p => ({ ...p, productCategoryId: categories[9].id })),
  ]

  const products = await Promise.all(
    allProductsData.map(product =>
      prisma.product.create({
        data: {
          ...product,
          createdAt: getRandomDate(),
          updatedAt: getRandomDate(),
        },
      })
    )
  )

  console.log('Created products:', products.length)

  // Create clients/carts
  const clients = [
    { clientName: 'John Smith', amount: 2348, amountUSD: 2348, methodsUSD: ['Credit Card'] },
    { clientName: 'Emily Johnson', amount: 1198, amountUSD: 1198, methodsUSD: ['PayPal'] },
    { clientName: 'Michael Brown', amount: 856, amountUSD: 856, methodsUSD: ['Debit Card'] },
    { clientName: 'Sarah Davis', amount: 3250, amountUSD: 3250, methodsUSD: ['Credit Card'] },
    { clientName: 'David Wilson', amount: 467, amountUSD: 467, methodsUSD: ['Apple Pay'] },
    { clientName: 'Jessica Martinez', amount: 1875, amountUSD: 1875, methodsUSD: ['Credit Card'] },
    { clientName: 'Christopher Taylor', amount: 2100, amountUSD: 2100, methodsUSD: ['PayPal'] },
    { clientName: 'Amanda Anderson', amount: 945, amountUSD: 945, methodsUSD: ['Debit Card'] },
    { clientName: 'Matthew Thomas', amount: 1560, amountUSD: 1560, methodsUSD: ['Credit Card'] },
    { clientName: 'Ashley Jackson', amount: 728, amountUSD: 728, methodsUSD: ['Google Pay'] },
    { clientName: 'Daniel White', amount: 4200, amountUSD: 4200, methodsUSD: ['Wire Transfer'] },
    { clientName: 'Jennifer Harris', amount: 1345, amountUSD: 1345, methodsUSD: ['Credit Card'] },
    { clientName: 'James Clark', amount: 890, amountUSD: 890, methodsUSD: ['PayPal'] },
    { clientName: 'Elizabeth Lewis', amount: 2650, amountUSD: 2650, methodsUSD: ['Credit Card'] },
    { clientName: 'Robert Robinson', amount: 1120, amountUSD: 1120, methodsUSD: ['Debit Card'] },
    { clientName: 'Michelle Walker', amount: 3800, amountUSD: 3800, methodsUSD: ['Credit Card'] },
    { clientName: 'William Hall', amount: 567, amountUSD: 567, methodsUSD: ['Apple Pay'] },
    { clientName: 'Stephanie Allen', amount: 2890, amountUSD: 2890, methodsUSD: ['PayPal'] },
    { clientName: 'Joseph Young', amount: 1450, amountUSD: 1450, methodsUSD: ['Credit Card'] },
    { clientName: 'Nicole King', amount: 985, amountUSD: 985, methodsUSD: ['Debit Card'] },
  ]

  const carts = await Promise.all(
    clients.map(client =>
      prisma.cart.create({
        data: {
          clientName: client.clientName,
          amount: client.amount,
          amountUSD: client.amountUSD,
          amountBS: 0,
          amountCOP: 0,
          methodsUSD: client.methodsUSD,
          methodsBS: [],
          methodsCOP: [],
        },
      })
    )
  )

  console.log('Created clients/carts:', carts.length)
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
