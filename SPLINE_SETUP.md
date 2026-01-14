# Spline Background Setup Guide

This project uses Spline for 3D parallax background animations. Follow these steps to set up your Spline scene:

## Step 1: Create a Spline Account
1. Go to [spline.design](https://spline.design)
2. Sign up for a free account
3. Open the Spline editor

## Step 2: Create Your Scene

### Option A: Points/Particles Object (Recommended)
1. Click **Add Object** → **Points** or **Particles**
2. Configure the particles:
   - Set a dark color scheme (white/gray particles on black)
   - Adjust count, size, and distribution
   - Make it subtle (low opacity)

### Option B: 3D Geometric Shapes
1. Add geometric shapes (spheres, cubes, etc.)
2. Arrange them in 3D space
3. Apply materials with low opacity

## Step 3: Set Up Camera Animation

1. Select the **Camera** object
2. In the **Events** panel, add a **Scroll** event
3. Configure the scroll event:
   - **Property**: Position Y (or Rotation X/Z for rotation)
   - **Range**: Set appropriate min/max values
   - **Easing**: Smooth or Linear

## Step 4: Export Your Scene

1. Click **Export** in the top menu
2. Choose **Code** export
3. Copy the URL (it will look like: `https://prod.spline.design/...`)

## Step 5: Add to Your Project

### Method 1: Environment Variable (Recommended)
1. Create a `.env` file in the project root:
```env
REACT_APP_SPLINE_SCENE_URL=https://prod.spline.design/your-scene-url.splinecode
```

2. Restart your dev server

### Method 2: Direct URL
1. Open `src/App.jsx`
2. Replace the empty string with your Spline URL:
```jsx
const splineSceneUrl = 'https://prod.spline.design/your-scene-url.splinecode';
```

## Advanced Configuration

### Custom Camera Movement
The component automatically controls camera position based on scroll. You can customize this in `SplineBackground.jsx`:

```jsx
// Adjust these values for different parallax effects
camera.position.y = -progress * 500;  // Vertical movement
camera.rotation.x = progress * 0.2;    // Rotation on X axis
camera.rotation.z = progress * 0.1;   // Rotation on Z axis
```

### Multiple Objects
If you have multiple objects to animate, add them in the `onLoad` handler:

```jsx
const object1 = spline.findObjectByName('Object1');
const object2 = spline.findObjectByName('Object2');
// Control each object independently
```

## Tips for AI-Themed Scenes

- **Neural Network**: Use particles connected with lines
- **Data Flow**: Animated particles moving along paths
- **Abstract Tech**: Geometric shapes with subtle animations
- **Minimalist**: Keep it subtle - low opacity, dark colors
- **Performance**: Use fewer particles for better performance

## Troubleshooting

- **Scene not loading**: Check the URL is correct and accessible
- **No animation**: Ensure Scroll events are set up in Spline
- **Performance issues**: Reduce particle count or object complexity
- **Camera not moving**: Check object names match in the code

## Example Spline Scene Ideas

1. **Floating Particles**: Simple particle system with scroll-based movement
2. **Neural Network**: Connected nodes that move with scroll
3. **Data Streams**: Particles flowing along curved paths
4. **Geometric Grid**: 3D grid that rotates/moves on scroll



