import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useSystem } from "../contexts/SystemContext";
import {
  Camera,
  Thermometer,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Cloud,
  CloudRain,
  Clock,
  Activity,
  CheckCircle2,
  Info,
} from "lucide-react";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
}

export default function CameraMonitoring() {
  const { activeBatch, isDetecting } = useSystem();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      time: "13:00",
      message: "Mẻ bánh bắt đầu - AI Vision phát hiện bánh tráng",
      type: "success",
    },
    {
      time: "14:15",
      message: "Độ khô đạt 45% - Tiến độ tốt",
      type: "info",
    },
    {
      time: "15:00",
      message: "Độ ẩm tăng nhẹ",
      type: "warning",
    },
  ]);

  const [cameraFeed, setCameraFeed] = useState(0);

  // Simulate camera feed refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraFeed((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add logs when batch progresses
  useEffect(() => {
    if (!activeBatch) return;

    const logInterval = setInterval(() => {
      const dryness = Math.round(activeBatch.dryness);
      const humidity = Math.round(activeBatch.humidity);

      if (
        dryness > 0 &&
        dryness % 20 === 0 &&
        Math.random() > 0.7
      ) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        let message = "";
        let type: "info" | "warning" | "success" | "alert" =
          "info";

        if (dryness >= 80) {
          message = `Độ khô đạt ${dryness}% - Sắp hoàn thành`;
          type = "success";
        } else if (humidity > 60) {
          message = `Độ ẩm cao ${humidity}% - Giám sát chặt`;
          type = "warning";
        } else {
          message = `Độ khô đạt ${dryness}% - Tiến độ tốt`;
          type = "info";
        }

        setLogs((prev) => [
          {
            time: timeStr,
            message,
            type,
          },
          ...prev.slice(0, 9),
        ]);
      }
    }, 5000);

    return () => clearInterval(logInterval);
  }, [activeBatch]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        );
      case "alert":
        return (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        );
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getLogStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
      case "warning":
        return "border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.05)]";
      case "alert":
        return "border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.05)]";
      default:
        return "border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.05)]";
    }
  };

  // Risk assessment
  const getRiskLevel = () => {
    if (!activeBatch) return null;

    const now = new Date();
    const hour = now.getHours();

    // Check for rain risk
    if (hour >= 16 && hour < 18) {
      return {
        level: "high",
        message: "Cảnh báo mưa",
        timeRange: "16:30 - 18:00",
        description: "Khả năng mưa cao trong khung giờ này",
        color: "red",
      };
    } else if (activeBatch.humidity > 65) {
      return {
        level: "medium",
        message: "Độ ẩm cao",
        timeRange: `${hour}:00 - ${hour + 2}:00`,
        description: "Độ ẩm tăng cao, giám sát chặt chẽ",
        color: "amber",
      };
    }

    return {
      level: "low",
      message: "Điều kiện tốt",
      timeRange: `${hour}:00 - ${hour + 3}:00`,
      description: "Không có rủi ro trong thời gian tới",
      color: "emerald",
    };
  };

  const riskInfo = getRiskLevel();

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Camera & Live Monitoring
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Theo dõi quá trình phơi bánh real-time
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <span>Camera AI Vision</span>
                </div>
                <Badge
                  className={`${isDetecting ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : activeBatch ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                >
                  {isDetecting
                    ? "Đang quét..."
                    : activeBatch
                      ? "Đang theo dõi"
                      : "Chế độ chờ"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-[#0B1121] overflow-hidden">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Grid overlay for camera effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B1121]/80 z-10" />
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-10">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="border border-cyan-500/5"
                        />
                      ))}
                    </div>

                    {/* Simulated scene */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                      {activeBatch ? (
                        <>
                          {/* Bánh tráng simulation */}
                          <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="relative w-full h-full max-w-2xl max-h-96">
                              {/* Main circle representing bánh tráng */}
                              <div
                                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100/20 via-yellow-50/10 to-amber-200/20 shadow-2xl opacity-80"
                                style={{
                                  filter: `brightness(${0.8 + activeBatch.dryness / 500})`,
                                }}
                              />

                              {/* Texture overlay */}
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${0.1 - activeBatch.dryness / 1000}) 0%, transparent 50%)`,
                                }}
                              />

                              {/* Detection box */}
                              <div className="absolute inset-0 border border-emerald-400/50 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <div className="absolute -top-6 left-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded font-mono shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                  BATCH DETECTED
                                </div>
                              </div>

                              {/* Dryness indicator on image */}
                              <div className="absolute bottom-4 right-4 bg-[#0B1121]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-emerald-500/30">
                                <div className="text-emerald-400 text-xs font-mono">
                                  Dryness:{" "}
                                  {Math.round(
                                    activeBatch.dryness,
                                  )}
                                  %
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <Camera className="w-16 h-16 text-slate-700 mx-auto" />
                            <p className="text-slate-500 font-mono text-sm">
                              Waiting for detection...
                            </p>
                            {isDetecting && (
                              <div className="flex items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                <span className="text-cyan-400 text-xs">
                                  Scanning...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Camera info overlay */}
                    <div className="absolute top-4 left-4 bg-[#0B1121]/80 backdrop-blur-md px-3 py-2 rounded-lg z-20 font-mono text-xs text-slate-300 space-y-1 border border-slate-800">
                      <div>CAM-01 | ZONE-A</div>
                      <div className="text-cyan-400">
                        {new Date().toLocaleTimeString("vi-VN")}
                      </div>
                    </div>

                    {/* Recording indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 border border-red-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg z-20">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                      <span className="text-red-400 text-xs font-semibold">
                        REC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Log */}
          <Card className="border-slate-800 bg-[#151E2F] shadow-md">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-white">
                <Clock className="w-5 h-5 text-cyan-400" />
                Lịch sử theo dõi mẻ bánh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${getLogStyle(log.type)}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-slate-400 bg-[#0B1121] px-2 py-0.5 rounded border border-slate-800">
                            {log.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-slate-700" />
                    <p>Chưa có log nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics & Risk Panel */}
        <div className="space-y-6">
          {/* Current Metrics */}
          <Card className="border-slate-800 bg-[#151E2F] shadow-md">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="text-base md:text-lg text-white">
                Chỉ số hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-5 space-y-4 pt-5">
              {activeBatch ? (
                <>
                  {/* Temperature */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <Thermometer className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Nhiệt độ
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {activeBatch.temperature.toFixed(1)}°C
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Độ ẩm
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {Math.round(activeBatch.humidity)}%
                    </div>
                  </div>

                  {/* Estimated Completion Time */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Dự kiến hoàn thành
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-white">
                        {activeBatch.estimatedCompletion.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        Còn {Math.floor(activeBatch.timeRemaining / 60)}h {activeBatch.timeRemaining % 60}p
                      </div>
                    </div>
                  </div>

                  {/* Dryness Progress */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Độ khô
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                        {Math.round(activeBatch.dryness)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"
                        style={{
                          width: `${activeBatch.dryness}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-400 font-medium">
                      {activeBatch.dryness < 50
                        ? "Giai đoạn đầu"
                        : activeBatch.dryness < 80
                          ? "Đang khô nhanh"
                          : "Sắp hoàn thành"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Chưa có batch đang hoạt động
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Camera đang standby...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Alert Box */}
          {riskInfo && (
            <Card
              className={`border shadow-[0_4px_20px_rgba(0,0,0,0.2)] bg-[#151E2F] ${
                riskInfo.level === "high"
                  ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : riskInfo.level === "medium"
                    ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "border-emerald-500/30"
              }`}
            >
              <CardHeader
                className={`border-b border-slate-800 pb-3 bg-[#0B1121]/50`}
              >
                <CardTitle className="text-base flex items-center gap-2">
                  {riskInfo.level === "high" ? (
                    <CloudRain className="w-5 h-5 text-red-400" />
                  ) : riskInfo.level === "medium" ? (
                    <Cloud className="w-5 h-5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-white">Risk Alert</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-lg font-bold ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : riskInfo.level === "medium"
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {riskInfo.message}
                    </span>
                    <Badge
                      className={
                        riskInfo.level === "high"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : riskInfo.level === "medium"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {riskInfo.level === "high"
                        ? "Cao"
                        : riskInfo.level === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {riskInfo.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-[#0B1121]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock
                      className={`w-4 h-4 ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : riskInfo.level === "medium"
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-400">
                      Khung giờ
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {riskInfo.timeRange}
                  </p>
                </div>

                {riskInfo.level !== "low" && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg border ${
                      riskInfo.level === "high"
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    />
                    <p
                      className={`text-xs ${
                        riskInfo.level === "high"
                          ? "text-red-200"
                          : "text-amber-200"
                      }`}
                    >
                      {riskInfo.level === "high"
                        ? "Khuyến nghị: Chuẩn bị thu bánh nếu tình hình xấu đi"
                        : "Khuyến nghị: Theo dõi sát và chuẩn bị phương án dự phòng"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}