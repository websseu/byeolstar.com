'use server'

import type { IStoreInput } from '@/lib/type'
import { StoreInputSchema } from '@/lib/validator'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../db'
import Store from '../db/model/store.model'

// 모든 스토어 조회
export async function getAllStores() {
  try {
    await connectToDatabase()

    const stores = await Store.find({}).sort({ createdAt: -1 }).lean()

    return {
      success: true,
      stores: JSON.parse(JSON.stringify(stores)),
    }
  } catch (error) {
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// ID로 특정 스토어 조회
export async function getStoreById(id: string) {
  try {
    await connectToDatabase()

    const store = await Store.findById(id).lean()

    if (!store) {
      return {
        success: false,
        error: '스토어를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      store: JSON.parse(JSON.stringify(store)),
    }
  } catch (error) {
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// storeId로 스토어 조회
export async function getStoreByStoreId(storeId: string) {
  try {
    await connectToDatabase()

    const store = await Store.findOne({ storeId }).lean()

    if (!store) {
      return {
        success: false,
        error: '스토어를 찾을 수 없습니다.',
      }
    }

    return {
      success: true,
      store: JSON.parse(JSON.stringify(store)),
    }
  } catch (error) {
    console.error('스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 지역별 스토어 조회
export async function getStoresByLocation(location: string) {
  try {
    await connectToDatabase()

    const stores = await Store.find({ location }).sort({ name: 1 }).lean()

    return {
      success: true,
      stores: JSON.parse(JSON.stringify(stores)),
      count: stores.length,
    }
  } catch (error) {
    console.error('지역별 스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 새 스토어 생성
export async function createStore(data: IStoreInput) {
  try {
    // 데이터 유효성 검사
    const validatedData = StoreInputSchema.parse(data)

    await connectToDatabase()

    // storeId 중복 확인
    const existingStore = await Store.findOne({ storeId: validatedData.storeId })
    if (existingStore) {
      return {
        success: false,
        error: '이미 존재하는 스토어 ID입니다.',
      }
    }

    const newStore = await Store.create(validatedData)

    revalidatePath('/admin/stores')

    return {
      success: true,
      message: '스토어가 성공적으로 등록되었습니다.',
      store: JSON.parse(JSON.stringify(newStore)),
    }
  } catch (error) {
    console.error('스토어 생성 오류:', error)

    return {
      success: false,
      error: '스토어 등록 중 오류가 발생했습니다.',
    }
  }
}

// 스토어 정보 수정
export async function updateStore(id: string, data: Partial<IStoreInput>) {
  try {
    await connectToDatabase()

    const existingStore = await Store.findById(id)
    if (!existingStore) {
      return {
        success: false,
        error: '수정할 스토어를 찾을 수 없습니다.',
      }
    }

    // storeId가 변경되는 경우 중복 확인
    if (data.storeId && data.storeId !== existingStore.storeId) {
      const duplicateStore = await Store.findOne({ storeId: data.storeId })
      if (duplicateStore) {
        return {
          success: false,
          error: '이미 존재하는 스토어 ID입니다.',
        }
      }
    }

    const updatedStore = await Store.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()

    revalidatePath('/admin/stores')
    revalidatePath('/stores')
    revalidatePath(`/stores/${existingStore.storeId}`)

    return {
      success: true,
      message: '스토어 정보가 성공적으로 수정되었습니다.',
      store: JSON.parse(JSON.stringify(updatedStore)),
    }
  } catch (error) {
    console.error('스토어 수정 오류:', error)

    return {
      success: false,
      error: '스토어 수정 중 오류가 발생했습니다.',
    }
  }
}

// 스토어 삭제
export async function deleteStore(id: string) {
  try {
    await connectToDatabase()

    const store = await Store.findById(id)
    if (!store) {
      return {
        success: false,
        error: '삭제할 스토어를 찾을 수 없습니다.',
      }
    }

    await Store.findByIdAndDelete(id)

    revalidatePath('/admin/stores')
    revalidatePath('/stores')

    return {
      success: true,
      message: `${store.name} 스토어가 성공적으로 삭제되었습니다.`,
    }
  } catch (error) {
    console.error('스토어 삭제 오류:', error)
    return {
      success: false,
      error: '스토어 삭제 중 오류가 발생했습니다.',
    }
  }
}

// 스토어 검색 (이름, 주소, 태그로)
export async function searchStores(query: string) {
  try {
    await connectToDatabase()

    const stores = await Store.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .sort({ name: 1 })
      .lean()

    return {
      success: true,
      stores: JSON.parse(JSON.stringify(stores)),
      count: stores.length,
    }
  } catch (error) {
    console.error('스토어 검색 오류:', error)
    return {
      success: false,
      error: '스토어 검색 중 오류가 발생했습니다.',
    }
  }
}

// 태그별 스토어 조회
export async function getStoresByTag(tag: string) {
  try {
    await connectToDatabase()

    const stores = await Store.find({ tags: tag }).sort({ name: 1 }).lean()

    return {
      success: true,
      stores: JSON.parse(JSON.stringify(stores)),
      count: stores.length,
    }
  } catch (error) {
    console.error('태그별 스토어 조회 오류:', error)
    return {
      success: false,
      error: '스토어 데이터를 불러오는데 실패했습니다.',
    }
  }
}

// 근처 스토어 조회 (위도, 경도 기반)
export async function getNearbyStores(
  latitude: number,
  longitude: number,
  maxDistance: number = 5000
) {
  try {
    await connectToDatabase()

    const stores = await Store.find({
      $and: [{ latitude: { $exists: true } }, { longitude: { $exists: true } }],
    }).lean()

    // 거리 계산 (간단한 유클리드 거리)
    const nearbyStores = stores
      .map((store) => {
        const distance = Math.sqrt(
          Math.pow((store.latitude - latitude) * 111000, 2) +
            Math.pow(
              (store.longitude - longitude) * 111000 * Math.cos((latitude * Math.PI) / 180),
              2
            )
        )
        return { ...store, distance }
      })
      .filter((store) => store.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)

    return {
      success: true,
      stores: JSON.parse(JSON.stringify(nearbyStores)),
      count: nearbyStores.length,
    }
  } catch (error) {
    console.error('근처 스토어 조회 오류:', error)
    return {
      success: false,
      error: '근처 스토어를 찾는데 실패했습니다.',
    }
  }
}
