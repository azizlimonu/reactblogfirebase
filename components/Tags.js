import React from 'react'

const Tags = ({ tags }) => {
  console.log(tags);
  tags.map((tag) => {
    console.log(tag.id);
  })
  return (
    <div>
      <div>
        <div className='blog-heading text-start py-2 mb-4'>
          Tags
        </div>

        <div className='tags'>
          {tags?.map((tag,i) => (
            <p className='tag' key={i}>
              {tag.id}
            </p>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Tags