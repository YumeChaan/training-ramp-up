import { put, takeEvery, all, call } from 'redux-saga/effects'
import {
  addStudent,
  addStudentSuccess,
  addStudentFailure,
  getStudents,
  getStudentsSuccess,
  getStudentsFailure,
  updateStudent,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudent,
  deleteStudentSuccess,
  deleteStudentFailure,
} from './gridSlice'

import { getStudentsAPI, addStudentAPI, updateStudentAPI, deleteStudentAPI } from '../../api/client'
import { toast } from 'react-toastify'
import { Student } from '../../utils/interfaces'
import { checkValid, age } from '../../utils/validators'

function* getStudentsSaga(): Generator<any, any, any> {
  try {
    const response = yield call(getStudentsAPI)
    const students: Student[] = response.data
    students.map((item: Student) => {
      item.dob = new Date(item.dob)
    })
    yield put(getStudentsSuccess(students))
  } catch (error) {
    yield put(getStudentsFailure())
  }
}

function* addStudentSaga(action: any): Generator<any, any, any> {
  const item: Student = action.payload
  if (checkValid(item)) {
    if (!item.gender) {
      item.gender = 'Male'
    }
    item.inEdit = false
    const itemToAdd = {
      name: item.name,
      gender: item.gender,
      dob: item.dob,
      address: item.address,
      mobile: item.mobile,
      age: age(item.dob),
    }
    try {
      const response = yield call(addStudentAPI, itemToAdd)
      // toast.success('Successfully Added', {
      //   position: toast.POSITION.TOP_RIGHT,
      // })
      const addedStudent = response.data
      addedStudent.dob = new Date(addedStudent.dob)
      yield put(addStudentSuccess(addedStudent))
    } catch (error) {
      yield put(addStudentFailure())
    }
  }
}

function* updateStudentSaga(action: any): Generator<any, any, any> {
  const item: Student = action.payload
  const id: number = item.id
  const itemToUpdate = {
    name: item.name,
    gender: item.gender,
    dob: item.dob,
    address: item.address,
    mobile: item.mobile,
    age: age(item.dob),
  }
  try {
    const response = yield call(updateStudentAPI, id, itemToUpdate)
    // toast.success('Successfully Updated', {
    //   position: toast.POSITION.TOP_RIGHT,
    // })
    const updatedStudent = response.data
    updatedStudent.dob = new Date(updatedStudent.dob)
    yield put(updateStudentSuccess({ inEdit: false, ...updatedStudent }))
  } catch (error) {
    yield put(updateStudentFailure())
  }
}

function* deleteStudentSaga(action: any): Generator<any, any, any> {
  const item: Student = action.payload
  const itemToDelete = item.id
  try {
    yield call(deleteStudentAPI, itemToDelete)
    // toast.success('Successfully Deleted', {
    //   position: toast.POSITION.TOP_RIGHT,
    // })
    yield put(deleteStudentSuccess(itemToDelete))
  } catch (error) {
    yield put(deleteStudentFailure())
  }
}

export default function* gridSaga() {
  yield all([
    takeEvery(getStudents, getStudentsSaga),
    takeEvery(addStudent, addStudentSaga),
    takeEvery(updateStudent, updateStudentSaga),
    takeEvery(deleteStudent, deleteStudentSaga),
  ])
}
