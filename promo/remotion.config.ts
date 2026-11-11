import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
// The GLB and rendered Blender frames are large; give the bundler room.
Config.setChromiumOpenGlRenderer("angle");
