# Using Your Spline Community Scene

You want to use this Spline scene:
**https://app.spline.design/community/file/fb5c9572-898e-4c53-a7ea-fab22311ea46**

## Quick Setup Steps

### Step 1: Open the Community File
1. Go to: https://app.spline.design/community/file/fb5c9572-898e-4c53-a7ea-fab22311ea46
2. Click **"Open in Editor"** or **"Duplicate"** button
3. This will open the scene in the Spline editor

### Step 2: Export the Scene
1. In the Spline editor, click **"Export"** in the top menu
2. Select **"Code"** export option
3. Copy the export URL (it will look like: `https://prod.spline.design/...`)

### Step 3: Add to Your Project

**Option A: Environment Variable (Recommended)**
1. Create a `.env` file in the project root:
```env
REACT_APP_SPLINE_SCENE_URL=https://prod.spline.design/your-exported-url-here.splinecode
```

2. Restart your dev server:
```bash
npm run dev
```

**Option B: Direct in Code**
1. Open `src/App.jsx`
2. Replace the URL:
```jsx
const splineSceneUrl = 'https://prod.spline.design/your-exported-url-here.splinecode';
```

## Customizing the Scene (Optional)

Once you have the scene open in Spline:

### Adjust Camera for Scroll Effect
1. Select the **Camera** object
2. The component will automatically control it based on scroll
3. You can adjust the movement intensity in `SplineBackground.jsx`:
   ```jsx
   const cameraY = useTransform(scrollYProgress, [0, 1], [0, -500]);
   ```

### Adjust Particles/Objects
1. Select any Particles or Points objects
2. They will automatically move with scroll
3. Adjust opacity/colors to match your design

### Make it Subtle
- Reduce particle count if needed
- Lower opacity values
- Use dark colors that match your black background

## Troubleshooting

**Scene not loading?**
- Make sure you exported the scene (community file URL won't work directly)
- Check the URL is correct and starts with `https://prod.spline.design/`
- Check browser console for errors

**No scroll animation?**
- The component handles scroll automatically
- Make sure the scene has a Camera object
- Check browser console for any errors

**Performance issues?**
- Reduce particle count in Spline
- Simplify the scene if it's too complex
- The component is optimized but complex scenes may lag

## Notes

- Community files need to be exported to get a usable URL
- The export URL is different from the community file URL
- Once exported, the URL will work with the React component
- You can customize the scene in Spline before exporting



