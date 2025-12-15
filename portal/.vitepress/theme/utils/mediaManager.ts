/**
 * 全局媒体管理器
 * 用于管理所有音视频播放器，确保同一时间只有一个媒体在播放
 */
import { ref, readonly } from 'vue'

type MediaElement = HTMLAudioElement | HTMLVideoElement
type MediaType = 'audio' | 'video'

interface MediaInstance {
    id: string
    type: MediaType
    element: MediaElement
    pause: () => void
}

// 存储所有注册的媒体实例
const mediaInstances = new Map<string, MediaInstance>()

// 当前正在播放的媒体ID
const currentPlayingId = ref<string | null>(null)

// 生成唯一ID
let idCounter = 0
function generateId(type: MediaType): string {
    return `${type}-${++idCounter}-${Date.now()}`
}

/**
 * 注册媒体实例
 */
function registerMedia(type: MediaType, element: MediaElement, pauseFn: () => void): string {
    const id = generateId(type)

    mediaInstances.set(id, {
        id,
        type,
        element,
        pause: pauseFn
    })

    return id
}

/**
 * 注销媒体实例
 */
function unregisterMedia(id: string): void {
    if (currentPlayingId.value === id) {
        currentPlayingId.value = null
    }
    mediaInstances.delete(id)
}

/**
 * 通知开始播放
 * 会暂停其他所有正在播放的媒体
 */
function notifyPlay(id: string): void {
    // 暂停所有其他媒体
    mediaInstances.forEach((instance, instanceId) => {
        if (instanceId !== id) {
            try {
                instance.pause()
            } catch (e) {
                // 忽略错误
            }
        }
    })

    currentPlayingId.value = id
}

/**
 * 通知停止播放
 */
function notifyPause(id: string): void {
    if (currentPlayingId.value === id) {
        currentPlayingId.value = null
    }
}

/**
 * 获取当前播放的媒体ID
 */
function getCurrentPlayingId(): Readonly<typeof currentPlayingId> {
    return readonly(currentPlayingId)
}

/**
 * 暂停所有媒体
 */
function pauseAll(): void {
    mediaInstances.forEach((instance) => {
        try {
            instance.pause()
        } catch (e) {
            // 忽略错误
        }
    })
    currentPlayingId.value = null
}

export const mediaManager = {
    registerMedia,
    unregisterMedia,
    notifyPlay,
    notifyPause,
    getCurrentPlayingId,
    pauseAll
}

export default mediaManager
