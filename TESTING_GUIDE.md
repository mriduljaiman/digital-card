# Testing Guide - Phase 8 Cinematic Scenes

## 🎯 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Create a Test Wedding Invitation

1. Go to: `http://localhost:3000/dashboard`
2. Click "Create New Invitation"
3. Fill in the form:
   - **Event Type:** Wedding
   - **Host Name:** Vijaya
   - **Co-Host Name:** Mridul
   - **Event Date:** Pick a future date
   - **Venue:** Test Venue
   - **Upload Photos:**
     - Upload a couple photo (will be labeled as COUPLE type)
     - Or upload individual photos (HOST and COHOST)
   - **Music:** Enable music and upload an MP3 file (or provide URL)
   - **Theme:** Select any theme
4. Click "Create Invitation"
5. Copy the generated URL (e.g., `/invite/vijaya-mridul-wedding-2`)

### 3. View the Cinematic Scene

1. Open the invitation URL
2. **You should see:**
   - ✅ Sacred fire with animated particles in the center
   - ✅ Golden mandap pillars
   - ✅ Your couple photo orbiting around the fire (fera animation)
   - ✅ Falling rose petals
   - ✅ Golden dust particles floating
   - ✅ Sparkles around the scene
   - ✅ Camera slowly orbiting the scene
   - ✅ Music playing automatically (if enabled)
   - ✅ Music toggle button in top-right corner
   - ✅ Bloom and depth of field effects
   - ✅ Sunset environment lighting

## 🎂 Test Birthday Invitation

### Create Birthday Invitation:
1. **Event Type:** Birthday
2. **Host Name:** Aarav
3. **Age:** 5 (optional)
4. **Upload Photo:** Birthday person photo
5. **Enable Music**

### Expected Result:
- ✅ 3-tier rotating cake
- ✅ 5 candles with animated flames (based on age)
- ✅ Confetti burst every 5 seconds
- ✅ Sparkles around cake
- ✅ 4 floating balloons
- ✅ Birthday person photo floating beside cake
- ✅ "Happy Birthday Aarav!" in neon style
- ✅ Camera orbiting and zooming
- ✅ Music playing

## 💍 Test Engagement Invitation

### Create Engagement Invitation:
1. **Event Type:** Engagement
2. **Upload couple photo**

### Expected Result:
- ✅ Same as wedding scene (romantic atmosphere)
- ✅ Couple photo orbiting
- ✅ Cinematic effects

## 🎵 Test Music Playback

1. **With Music Enabled:**
   - Music should start playing automatically after page load
   - If auto-play is blocked by browser, music plays after first click
   - Music toggle button appears in top-right corner
   - Click button to pause/play music
   - Music loops continuously

2. **Without Music:**
   - No music toggle button appears
   - Scene plays silently

## 📸 Test Photo Integration

### Scenario 1: Couple Photo Uploaded
```
Wedding invitation with COUPLE photo
→ Couple cutout orbits around fire
```

### Scenario 2: Only Host Photo
```
Wedding invitation with only HOST photo
→ Host photo used as fallback for couple
```

### Scenario 3: No Photos Uploaded
```
Wedding invitation with no photos
→ Shows default placeholder or empty plane
```

### Scenario 4: Birthday with Photo
```
Birthday invitation with HOST photo
→ Birthday person floats beside cake
```

## 🎬 Camera Animation Tests

### Wedding Scene:
- Camera should orbit slowly around the mandap
- Radius: ~8 units
- Height: ~3 units with slight variation
- Speed: Slow and cinematic
- Always looking at center (fire)

### Birthday Scene:
- Camera should orbit around the cake
- Zoom in and out slightly
- Smooth movements

## 🐛 Common Issues & Fixes

### Issue 1: No 3D Scene Visible
**Symptoms:** Just seeing purple background, no 3D
**Fix:**
- Check browser console for errors
- Ensure WebGL is enabled in browser
- Try different browser (Chrome recommended)
- Clear cache and reload

### Issue 2: Photos Not Showing
**Symptoms:** Scene loads but no photo cutout
**Fix:**
- Check if photos were uploaded successfully
- Verify photo paths in database
- Check browser console for 404 errors on image paths
- Ensure photo processedPath is set

### Issue 3: Music Not Playing
**Symptoms:** Music toggle button shows but no sound
**Fix:**
- Check if browser auto-play is blocked
- Click anywhere on page to enable audio
- Check browser audio permissions
- Verify musicUrl is correct
- Check if MP3 file exists at the path

### Issue 4: Camera Not Moving
**Symptoms:** Scene is static, no orbit
**Fix:**
- Check browser console for Three.js errors
- Ensure scene is rendering (check frame rate)
- Verify useFrame hooks are working

### Issue 5: Particles Not Visible
**Symptoms:** Scene loads but no fire/petals/confetti
**Fix:**
- Check GPU/WebGL performance
- Reduce particle count in component props
- Try different browser

## 🔍 Debugging Checklist

- [ ] Server running: `npm run dev`
- [ ] Database connected (check Prisma)
- [ ] Invitation created with photos
- [ ] Photos uploaded successfully
- [ ] Music file uploaded (if using music)
- [ ] Browser WebGL enabled
- [ ] Browser console shows no errors
- [ ] Network tab shows photos loading
- [ ] Event type is correct (WEDDING, BIRTHDAY, etc.)

## 📊 Performance Expectations

| Metric | Expected Value |
|--------|---------------|
| Scene Load Time | < 2 seconds |
| Frame Rate | 60 FPS (desktop) |
| Frame Rate | 30 FPS (mobile) |
| Memory Usage | ~50MB per scene |
| Photo Load Time | < 500ms |
| Music Start Time | Immediate or after first click |

## 🎯 Success Criteria

The integration is successful if:

✅ **Wedding Events:**
- Fire particles animated
- Couple photo orbiting fire
- Petals falling
- Camera orbiting smoothly
- Music playing

✅ **Birthday Events:**
- Cake rotating
- Candles with flames
- Confetti bursting
- Photo floating beside cake
- Music playing

✅ **All Events:**
- No console errors
- Smooth 60 FPS rendering
- Music controls working
- Photos displaying correctly
- Theme colors applied
- Responsive on mobile

## 🚀 Next: Test on Different Devices

1. **Desktop Chrome:** Best performance
2. **Desktop Firefox:** Should work fine
3. **Desktop Safari:** May need WebGL tweaks
4. **Mobile Chrome:** Test touch interactions
5. **Mobile Safari:** Check auto-play fallback
6. **Tablet:** Test responsiveness

## 📝 Report Issues

If you find any issues:

1. Open browser console (F12)
2. Screenshot the error
3. Note:
   - Event type (wedding/birthday)
   - Browser & version
   - What you expected vs what happened
   - Any console errors
4. Check PHASE8_INTEGRATION_COMPLETE.md for known issues

---

**Happy Testing! 🎉**

If everything works as expected, you should see Hollywood-level cinematic animations with your photos, music, and smooth camera movements! 🎬✨
