import React from 'react'

const ImageUploadForm = ({ images, errors, onImageUpload, onRemoveImage, onSetMainImage }) => {
   return (
      <div className="mb-4">
         <h5 className="card-title mb-3">이미지</h5>
         <div className="mb-3">
            <input type="file" className={`form-control ${errors.images ? 'is-invalid' : ''}`} accept="image/*" multiple onChange={onImageUpload} />
            {errors.images && <div className="invalid-feedback">{errors.images}</div>}
         </div>
         <div className="row">
            {images.map((image, index) => (
               <div key={index} className="col-md-4 mb-3">
                  <div className="card">
                     <img src={image.preview} className="card-img-top" alt={`Preview ${index + 1}`} />
                     <div className="card-body">
                        <div className="form-check mb-2">
                           <input type="radio" className="form-check-input" name="mainImage" checked={image.isMain} onChange={() => onSetMainImage(index)} />
                           <label className="form-check-label">대표 이미지</label>
                        </div>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onRemoveImage(index)}>
                           삭제
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

export default ImageUploadForm
