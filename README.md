# AssuMement Navigator — Week 1–2 Starter

This is a minimal Expo/React Native starter for the AssuMement Park Navigator project.

## What’s included
- **Three screens**: Home (add stops), Results (map placeholder + settings), Guide (step-by-step placeholder).
- **Simple components**: Stop list items.
- **Sample data**: `data/poi.csv`, `data/paths.csv`.
- **Clean UI** with ≤8 touch targets per screen.

## Quick start
1. Install Node.js (LTS) and `npm`.
2. Install Expo CLI: `npm i -g expo` (or use `npx expo` without global install).
3. From this folder run:  
   ```bash
   npm install
   npx expo start
   ```
4. Open the Expo Go app on your phone and scan the QR code.

> If you see errors about missing native packages, run `npm install` again to fetch dependencies listed in `package.json`.

## Student tasks (Week 1–2)
- **Week 1**: Adjust texts, test screen navigation, update sample POIs and paths.
- **Week 2**: Finish add/remove/reorder stops on Home; route list appears on Results.

## Next steps (Week 3+)
- Replace the Results **map placeholder** with Mapbox.
- Draw walkways from `data/paths.csv` and pins from `data/poi.csv`.
- Implement a real shortest-path finder for each leg.
- Add “Order: My Order / Best Order” and “Accessible only” toggles.
