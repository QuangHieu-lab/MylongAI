import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  condition: string;
}

interface VoiceNotificationProps {
  weatherData: WeatherData;
}

export function VoiceNotification({ weatherData }: VoiceNotificationProps) {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const API_KEY = 'sk_04bcb21f88cafbf9859898e244620e47e6dda08182b7ab86';
  const VOICE_ID = 'ueSxRO0nLF1bj93J2hVt';

  // chuyển số → chữ tiếng Việt
  const numberToVietnamese = (num: number) => {

    const ones = [
      "không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"
    ];

    const tens = [
      "","mười","hai mươi","ba mươi","bốn mươi",
      "năm mươi","sáu mươi","bảy mươi","tám mươi","chín mươi"
    ];

    if (num < 10) return ones[num];

    if (num < 100) {
      const t = Math.floor(num / 10);
      const o = num % 10;

      if (o === 0) return tens[t];
      return `${tens[t]} ${ones[o]}`;
    }

    return num.toString();
  };

  // đọc số thập phân (32.4)
  const readDecimal = (num: number) => {

    const parts = num.toFixed(1).split(".");

    const integerPart = numberToVietnamese(parseInt(parts[0]));
    const decimalPart = numberToVietnamese(parseInt(parts[1]));

    return `${integerPart} phẩy ${decimalPart}`;
  };

  const generateWeatherScript = () => {

    const riskLevel =
      weatherData.rainChance > 60 ? 'cao' :
      weatherData.rainChance > 30 ? 'trung bình' :
      'thấp';

    const humidityLevel =
      weatherData.humidity > 70 ? 'rất cao' :
      weatherData.humidity > 60 ? 'cao' :
      'bình thường';

    return `
      Thông báo thời tiết khu vực phơi bánh tráng Mỹ Lồng.

      Nhiệt độ hiện tại: ${readDecimal(weatherData.temperature)} độ C.

      Độ ẩm không khí: ${numberToVietnamese(Math.round(weatherData.humidity))} phần trăm, ở mức ${humidityLevel}.

      Khả năng mưa: ${numberToVietnamese(Math.round(weatherData.rainChance))} phần trăm, mức độ rủi ro ${riskLevel}.

      Tốc độ gió: ${readDecimal(weatherData.windSpeed)} ki lô mét trên giờ.

      Tình trạng thời tiết: ${weatherData.condition}.

      ${weatherData.rainChance > 60
        ? 'Cảnh báo. Nguy cơ mưa cao. Khuyến nghị chuẩn bị thu bánh hoặc che chắn.'
        : weatherData.rainChance > 30
        ? 'Lưu ý. Theo dõi sát diễn biến thời tiết trong giờ tới.'
        : 'Điều kiện phơi bánh ổn định. Có thể tiếp tục phơi an toàn.'}
    `.trim();
  };

  const speakWeather = async () => {

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    setIsLoading(true);

    try {

      const text = generateWeatherScript();

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0,
              use_speaker_boost: true
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        toast.error('Lỗi phát âm thanh');
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      setIsPlaying(true);

      await audio.play();

      toast.success('Đang phát thông báo thời tiết', {
        description: 'Bấm lại để dừng'
      });

    } catch (error) {

      console.error(error);

      toast.error('Không thể phát thông báo', {
        description: 'Vui lòng kiểm tra kết nối hoặc API key'
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={speakWeather}
      disabled={isLoading}
      className={`
        ${isPlaying
          ? 'bg-gradient-to-r from-red-500 to-rose-600'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600'}
        text-white shadow-lg hover:shadow-xl transition-all
        border-none px-5 py-2.5 rounded-xl font-semibold
        flex items-center gap-2
      `}
    >

      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải...</span>
        </>
      ) : isPlaying ? (
        <>
          <VolumeX className="w-5 h-5" />
          <span>Dừng phát</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          <span>Nghe thông báo thời tiết</span>
        </>
      )}

    </Button>
  );
}