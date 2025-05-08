import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, resetStatus, deletePost } from '../features/posts/postSlice';

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    post,
    isLoading,
    isError,
    message: postMessage,
    isSuccess: postIsSuccess,
  } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch, postId]);

  useEffect(() => {
    if (isError && postMessage) {
      alert(`Hata: ${postMessage}`); 
      dispatch(resetStatus());
    }
    if (postIsSuccess && postMessage === 'Yazı başarıyla silindi!') {
      alert(postMessage); 
      navigate('/');
    }
  }, [isError, postIsSuccess, postMessage, navigate, dispatch]);

  const handleDelete = () => {
    if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      dispatch(deletePost(postId));
    }
  };

  if (isLoading && !post) {
    return ( <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><span className="loading loading-lg loading-spinner text-primary"></span></div> );
  }

  if (isError && !post && !isLoading) {
    return ( <div role="alert" className="alert alert-error mt-4"> /* ... hata SVG ... */ <span>Hata! {postMessage || 'Yazı bulunamadı veya yüklenirken bir sorun oluştu.'}</span></div> );
  }

  if (!post && !isLoading && !isError) {
      return <div className="text-center mt-10 p-4">Yazı bulunamadı.</div>
  }

  
  return (
    <div className="bg-base-100 p-6 md:p-8 rounded-lg shadow-lg">
      <article className="prose lg:prose-xl max-w-none"> 
        {post?.imageUrl && (
          <figure className="mb-8"> 
             <img
              src={`http://localhost:5001${post.imageUrl}`}
              alt={post.title?.replace(/\"/g, '')}
              className="w-full h-auto object-cover rounded-lg shadow-md" 
            />
          </figure>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4"> 
          <h1 className="text-3xl md:text-4xl font-bold !mb-0"> 
              {post?.title?.replace(/\"/g, '')}
          </h1>
          {post?.wins > 0 && (
            <div className="badge badge-lg badge-success badge-outline whitespace-nowrap">
              🏆 Kazanan ({post.wins} kez)
            </div>
          )}
        </div>

        <div className="text-sm text-base-content/70 mb-6 border-b border-base-300 pb-3">
          <span>Yazar: <strong>{post?.author?.username || 'Bilinmiyor'}</strong></span> |{' '}
          <span>Kategori: <strong>{post?.category?.replace(/\"/g, '')}</strong></span> |{' '}
          <span>Toplam Oy: <strong>{post?.votes !== undefined ? post.votes : 0}</strong></span> |{' '}
          <span>Tarih: {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
        </div>

        <div className="prose-p:my-4 prose-headings:my-5 whitespace-pre-wrap"> 
            {post?.content?.replace(/\"/g, '')}
        </div>

        {user && post?.author && user._id === post.author._id && (
          <div className="mt-10 pt-6 border-t border-base-300 flex justify-end space-x-4"> 
            <Link to={`/edit-post/${post._id}`} className="btn btn-success">
              Düzenle
            </Link>
            <button
              onClick={handleDelete}
              className={`btn btn-error ${isLoading && postMessage !== 'Yazı başarıyla güncellendi!' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading && postMessage !== 'Yazı başarıyla silindi!'}
            >
              {isLoading && postMessage !== 'Yazı başarıyla silindi!' ? (
                  <span className="loading loading-spinner loading-xs"></span>
              ) : (
                  'Sil'
              )}
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

export default PostDetailPage;