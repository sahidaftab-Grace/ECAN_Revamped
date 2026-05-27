# Past Board Member Photos

Place individual photos here, then import and reference them in `src/data/board.ts`.

## How to add a photo

1. Drop the image file in this folder, e.g. `seshraj-bhattarai.jpeg`

2. Import it at the top of `src/data/board.ts`:

   ```ts
   import seshrajPhoto from "@/assets/past-board/seshraj-bhattarai.jpeg";
   ```

3. Add the `image` field to the matching member entry:
   ```ts
   { name: "Seshraj Bhattarai", role: "President", image: seshrajPhoto },
   ```

If no `image` is provided, the member card will show their initials instead.
