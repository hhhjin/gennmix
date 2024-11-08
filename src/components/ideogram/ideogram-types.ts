export const aspect_ratios = [
  "ASPECT_1_1",
  "ASPECT_10_16",
  "ASPECT_16_10",
  "ASPECT_9_16",
  "ASPECT_16_9",
  "ASPECT_3_4",
  "ASPECT_4_3",
  "ASPECT_3_2",
  "ASPECT_2_3",
  "ASPECT_1_3",
  "ASPECT_3_1",
] as const;

export type AspectRatio = (typeof aspect_ratios)[number];

export const models = ["V_1", "V_1_TURBO", "V_2", "V_2_TURBO"] as const;

export type Model = (typeof models)[number];

export const magic_prompt_options = ["AUTO", "ON", "OFF"] as const;

export type MagicPromptOption = (typeof magic_prompt_options)[number];

export const style_types = [
  "AUTO",
  "GENERAL",
  "REALISTIC",
  "DESIGN",
  "RENDER_3D",
  "ANIME",
] as const;

export type StyleType = (typeof style_types)[number];

export const resolutions = [
  "RESOLUTION_512_1536",
  "RESOLUTION_576_1408",
  "RESOLUTION_576_1472",
  "RESOLUTION_576_1536",
  "RESOLUTION_640_1024",
  "RESOLUTION_640_1344",
  "RESOLUTION_640_1408",
  "RESOLUTION_640_1472",
  "RESOLUTION_640_1536",
  "RESOLUTION_704_1152",
  "RESOLUTION_704_1216",
  "RESOLUTION_704_1280",
  "RESOLUTION_704_1344",
  "RESOLUTION_704_1408",
  "RESOLUTION_704_1472",
  "RESOLUTION_720_1280",
  "RESOLUTION_736_1312",
  "RESOLUTION_768_1024",
  "RESOLUTION_768_1088",
  "RESOLUTION_768_1152",
  "RESOLUTION_768_1216",
  "RESOLUTION_768_1232",
  "RESOLUTION_768_1280",
  "RESOLUTION_768_1344",
  "RESOLUTION_832_960",
  "RESOLUTION_832_1024",
  "RESOLUTION_832_1088",
  "RESOLUTION_832_1152",
  "RESOLUTION_832_1216",
  "RESOLUTION_832_1248",
  "RESOLUTION_864_1152",
  "RESOLUTION_896_960",
  "RESOLUTION_896_1024",
  "RESOLUTION_896_1088",
  "RESOLUTION_896_1120",
  "RESOLUTION_896_1152",
  "RESOLUTION_960_832",
  "RESOLUTION_960_896",
  "RESOLUTION_960_1024",
  "RESOLUTION_960_1088",
  "RESOLUTION_1024_640",
  "RESOLUTION_1024_768",
  "RESOLUTION_1024_832",
  "RESOLUTION_1024_896",
  "RESOLUTION_1024_960",
  "RESOLUTION_1024_1024",
  "RESOLUTION_1088_768",
  "RESOLUTION_1088_832",
  "RESOLUTION_1088_896",
  "RESOLUTION_1088_960",
  "RESOLUTION_1120_896",
  "RESOLUTION_1152_704",
  "RESOLUTION_1152_768",
  "RESOLUTION_1152_832",
  "RESOULTION_1152_864",
  "RESOLUTION_1152_896",
  "RESOLUTION_1216_704",
  "RESOLUTION_1216_768",
  "RESOLUTION_1216_832",
  "RESOLUTION_1232_768",
  "RESOLUTION_1248_832",
  "RESOLUTION_1280_704",
  "RESOLUTION_1280_720",
  "RESOLUTION_1280_768",
  "RESOLUTION_1280_800",
  "RESOLUTION_1312_736",
  "RESOLUTION_1344_640",
  "RESOLUTION_1344_704",
  "RESOLUTION_1344_768",
  "RESOLUTION_1408_576",
  "RESOLUTION_1408_640",
  "RESOLUTION_1408_704",
  "RESOLUTION_1472_576",
  "RESOLUTION_1472_640",
  "RESOLUTION_1472_704",
  "RESOLUTION_1536_512",
  "RESOLUTION_1536_576",
  "RESOLUTION_1536_640",
] as const;

export type Resolution = (typeof resolutions)[number];

export const color_palette_names = [
  "EMBER",
  "FRESH",
  "JUNGLE",
  "MAGIC",
  "MELON",
  "MOSAIC",
  "PASTEL",
  "ULTRAMARINE",
] as const;

export type ColorPalette =
  | {
      name: ColorPaletteName;
    }
  | {
      members: ColorPaletteMember[];
    };

export type ColorPaletteName = (typeof color_palette_names)[number];

export type ColorPaletteMember = {
  color_hex: string;
  color_weight?: number;
};
