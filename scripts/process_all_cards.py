import os, json
from PIL import Image, ImageDraw, ImageOps
import numpy as np

# Exact bounding boxes (x0, y0, x1, y1) inclusive
CROP_BOXES = {
    'amazon-pay-icici': (5, 0, 993, 612),
    'amex-mrcc': (4, 0, 994, 630),
    'axis-horizon': (3, 0, 996, 626),
    'axis-magnus': (0, 2, 630, 996),
    'bob-eterna': (9, 0, 979, 618),
    'bob-ethiad': (46, 0, 981, 588),
    'flipkart-axis-bank': (24, 0, 974, 619),
    'hdfc-biz-black': (20, 0, 978, 609),
    'hdfc-diners-club-metal': (7, 0, 991, 624),
    'hdfc-diners-club-privilege': (5, 0, 994, 630),
    'hdfc-infinia': (0, 0, 998, 628),
    'hdfc-marriott-bonvoy': (26, 0, 973, 607),
    'hdfc-millennia': (1, 0, 997, 630),
    'hdfc-regalia-gold': (29, 0, 970, 601),
    'hdfc-swiggy-blck': (9, 0, 989, 620),
    'hdfc-swiggy-orgne': (21, 0, 978, 622),
    'hdfc-tata-neu-infinity': (0, 1, 630, 997),
    'hdfc-tata-neu-plus': (0, 3, 630, 995),
    'hsbc-live-plus': (0, 11, 630, 987),
    'hsbc-premier': (5, 0, 625, 990),
    'hsbc-rupay-cashback': (6, 0, 624, 981),
    'hsbc-travel-one': (0, 3, 630, 995),
    'idfc-first-power-plus': (17, 0, 981, 623),
    'indusind-eazydiner': (5, 0, 994, 623),
    'indusind-tiger': (0, 0, 629, 998),
    'kiwi-yes-bank': (1, 0, 998, 629),
    'rbl-indianoil-xtra': (0, 1, 630, 997),
    'sbi-bpcl-octane': (0, 0, 999, 629),
    'sbi-cashback': (0, 3, 630, 995),
    'sbi-phonepe-black': (4, 0, 626, 998),
    'bobcard-scapia': (5, 35, 625, 958),
}

def make_rounded_mask(width, height, radius=37):
    scale = 4
    mask_large = Image.new("L", (width * scale, height * scale), 0)
    draw = ImageDraw.Draw(mask_large)
    draw.rounded_rectangle(
        [(0, 0), (width * scale - 1, height * scale - 1)],
        radius=radius * scale,
        fill=255
    )
    return mask_large.resize((width, height), Image.Resampling.LANCZOS)

def process_card(card_id, rel_path, orientation, preview_mode=False):
    src_path = os.path.join('public', 'credit-card-imgs-backup', os.path.basename(rel_path))
    im = Image.open(src_path).convert('RGBA')
    
    box = CROP_BOXES[card_id]
    # Crop (PIL crop takes (left, upper, right, lower))
    # Box is inclusive x0, y0, x1, y1 so right = x1+1, lower = y1+1
    crop_rect = (box[0], box[1], box[2] + 1, box[3] + 1)
    card_cropped = im.crop(crop_rect)
    
    target_w, target_h = (1000, 631) if orientation == 'horizontal' else (631, 1000)
    
    # Calculate fit
    # Scale card to fill target dimensions while maintaining aspect ratio
    cw, ch = card_cropped.size
    scale = max(target_w / cw, target_h / ch)
    new_w = int(round(cw * scale))
    new_h = int(round(ch * scale))
    card_resized = card_cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center crop to target_w, target_h (removes at most 1-2px from slightly mismatched aspect ratios)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    card_canvas = card_resized.crop((left, top, left + target_w, top + target_h))
    
    # Apply standard anti-aliased corner mask
    mask = make_rounded_mask(target_w, target_h, radius=37)
    
    # Combine original alpha with mask alpha
    orig_alpha = np.array(card_canvas.split()[-1], dtype=np.float32) / 255.0
    mask_alpha = np.array(mask, dtype=np.float32) / 255.0
    combined_alpha = (orig_alpha * mask_alpha * 255.0).astype(np.uint8)
    
    result = card_canvas.copy()
    result.putalpha(Image.fromarray(combined_alpha))
    
    out_dir = 'scripts/cleaned_preview' if preview_mode else os.path.join('public', 'credit-card-imgs')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, os.path.basename(rel_path))
    result.save(out_path, format='PNG', optimize=True)
    return out_path, result.size

with open('data/cards.json', encoding='utf-8') as f:
    cards = json.load(f)

print("Processing preview of all 31 cards:")
for c in cards:
    cid = c['id']
    rel = c['image']
    ori = c.get('orientation', 'horizontal')
    p, sz = process_card(cid, rel, ori, preview_mode=True)
    print(f"Processed: {cid:<26} -> {sz}")

