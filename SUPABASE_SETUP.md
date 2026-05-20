# BeautyCare Supabase Integration Guide

## Overview
This guide walks you through setting up Supabase as your database backend for the BeautyCare system.

## Prerequisites
- Supabase account (free tier available at https://supabase.com)
- Node.js installed
- BeautyCare project set up

---

## STEP 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Project Name**: `beautycare` (or your preference)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location (e.g., `ap-southeast-1` for Asia)
4. Click **"Create new project"** - Wait for setup (2-3 minutes)

---

## STEP 2: Get Your Credentials

1. Go to **Project Settings** → **API** (in sidebar)
2. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **Anon Public Key** (the `anon` key)

3. Open `.env.local` in your project root and paste:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## STEP 3: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy-paste the entire content from `sql_migrations.sql` (in project root)
4. Click **"Run"** (or Cmd+Enter)
5. All tables will be created automatically ✓

---

## STEP 4: Insert Initial Products

1. Go to **SQL Editor** → **New Query**
2. Paste this SQL to add your products:

```sql
INSERT INTO products (name, category, price, oprice, stock, emoji, badge, rating, description)
VALUES
('Rose Glow Vitamin C Serum', 'Skincare', 899, 1200, 45, '🧴', 'sale', 4.8, 'Brightening serum with 15% Vitamin C and rose hip oil for radiant, even-toned skin.'),
('Hydra Velvet Lip Gloss', 'Makeup', 350, NULL, 80, '💋', 'new', 4.6, 'Ultra-glossy lip color with hyaluronic acid for plump, moisturized lips all day.'),
('Silk Repair Hair Mask', 'Haircare', 650, NULL, 30, '💆', 'bestseller', 4.9, 'Deep conditioning treatment with keratin and argan oil for silky, frizz-free hair.'),
('Glow Mist Setting Spray', 'Skincare', 520, NULL, 60, '✨', '', 4.5, 'Refreshing setting spray that locks in makeup while giving a dewy, luminous finish.'),
('Velvet Matte Foundation', 'Makeup', 1100, 1400, 25, '🎨', 'sale', 4.7, 'Full-coverage matte foundation with SPF 30. Buildable formula for all skin types.'),
('Lavender Body Butter', 'Body Care', 480, NULL, 55, '🫧', '', 4.4, 'Rich whipped body butter with shea and lavender oil for deeply moisturized skin.'),
('Petal Bloom Eau de Parfum', 'Fragrance', 1850, NULL, 20, '🌸', 'new', 4.9, 'A feminine floral fragrance with notes of peony, jasmine, and warm sandalwood.'),
('Pro Blending Brush Set', 'Tools & Brushes', 750, NULL, 40, '🖌', '', 4.6, '8-piece professional brush set with ultra-soft synthetic bristles for flawless application.'),
('Niacinamide Pore Toner', 'Skincare', 420, NULL, 70, '💧', '', 4.5, '10% niacinamide toner that minimizes pores, controls oil, and brightens skin tone.'),
('Glossy Brow Gel', 'Makeup', 280, NULL, 90, '🪮', '', 4.3, 'Clear brow gel that keeps brows groomed, defined, and perfectly in place all day.');
```

3. Click **Run** ✓

---

## STEP 5: Set Up Authentication (Optional but Recommended)

To enable user authentication via Supabase:

1. Go to **Authentication** (left sidebar)
2. Click **"Providers"**
3. Enable:
   - Email / Password (recommended for staff login)
   - Google (optional for customers)

4. Go to **Policies** tab
5. Enable **RLS** (Row Level Security) - this secures your data

---

## STEP 6: Install Dependencies

The Supabase client library is already installed. Verify with:
```bash
npm list @supabase/supabase-js
```

---

## STEP 7: Restart Your Dev Server

```bash
npm run dev
```

Your app will now connect to Supabase! ✓

---

## Testing the Connection

1. Open http://localhost:5173
2. Login as admin (admin/admin123)
3. Go to Products tab
4. Add a new product - it should save to Supabase
5. Check in Supabase Dashboard → **Table Editor** → **products** to see the new product ✓

---

## Environment Variables (.env.local)

Keep this file secret and never commit to GitHub. Add to `.gitignore`:

```
.env.local
.env*.local
```

---

## Troubleshooting

### "Connection error" or blank products
- Check `.env.local` has correct credentials
- Verify Supabase project is running (check Supabase Dashboard)
- Check browser console for errors

### RLS (Row Level Security) errors
- Go to Supabase Dashboard → **Authentication** → **Policies**
- Make sure policies are configured or RLS is disabled for development

### Still getting issues?
- Check `/src/config/supabase.js` is properly configured
- Verify API keys are correct (not reversed)
- Restart dev server

---

## Next Steps

After confirming the basic connection:

1. **Set up real authentication** - Replace hardcoded login
2. **Configure RLS policies** - For production security
3. **Enable backups** - In Supabase settings
4. **Monitor usage** - Check project stats in dashboard

---

Questions? Check:
- Supabase Docs: https://supabase.com/docs
- React docs: https://react.dev
