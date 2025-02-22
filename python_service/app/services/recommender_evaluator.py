# # app/services/recommender_evaluator.py
# from copy import deepcopy
# import logging 
 
# class RecommenderEvaluator:
#     def __init__(self, user_cf):
#         logging.debug("RecommenderEvaluator initialized", extra={"user_cf": user_cf})
#         self.user_cf = user_cf
        
#     async def prepare_train_test_data(self, interactions, test_size=0.2):
#         sorted_interactions = sorted(interactions, key=lambda x: x['createdAt'])
#         split_idx = int(len(interactions) * (1 - test_size))
#         return sorted_interactions[:split_idx], sorted_interactions[split_idx:]

#     def calculate_precision_recall_k(self, actual, predicted, k):
#         actual_set = set(actual)
#         predicted_set = set(predicted[:k])
        
#         true_positives = len(actual_set.intersection(predicted_set))
        
#         precision = true_positives / k if k > 0 else 0
#         recall = true_positives / len(actual_set) if len(actual_set) > 0 else 0
        
#         return precision, recall

#     def calculate_map(self, actual, predicted):
#         if not actual:
#             return 0.0
            
#         score = 0.0
#         num_hits = 0.0
        
#         for i, p in enumerate(predicted):
#             if p in actual and p not in predicted[:i]:
#                 num_hits += 1
#                 score += num_hits / (i + 1)
                
#         return score / min(len(actual), len(predicted))

#     async def evaluate(self, data, k=7, test_size=0.2):
#         try:
#             interactions = data['interactions']
#             reviews = data['reviews']
#             # logging.debug(f"Received {len(interactions)} interactions for evaluation.")
#             # logging.debug(f"Received {len(reviews)} reviews for evaluation.")
#             # logging.debug(interactions[:])
#             # logging.debug(reviews[:])
            
#             train_interactions, test_interactions = await self.prepare_train_test_data(
#                 interactions, test_size
#             )
#             logging.debug(f"Received {len(interactions)} interactions and {len(reviews)} reviews for evaluation.")
#             logging.debug(f"Train interactions: {len(train_interactions)}")
#             logging.debug(f"Test interactions: {len(test_interactions)}")
            
#             test_users = set(inter['userId'] for inter in test_interactions)
            
#             metrics = {
#                 'precisions': [],
#                 'recalls': [],
#                 'maps': []
#             }
            
#             for user_id in test_users:
#                 actual_items = [
#                     str(inter['toolId']) 
#                     for inter in test_interactions 
#                     if inter['userId'] == user_id and inter['interactionType'] in ['PURCHASE', 'RATING', 'VIEW', 'ADD_CART', 'CLICK', 'SHARE']
#                 ]
                
#                 if not actual_items:
#                     continue
                    
#                 # Build matrix from training data
#                 user_item_matrix_df, csr_matrix = self.user_cf.build_user_item_matrix(train_interactions)
#                 user_item_matrix_df = self.user_cf.integrate_reviews(user_item_matrix_df, reviews)
#                 user_item_matrix_df = self.user_cf.normalize_matrix(user_item_matrix_df)
                
#                 # Get recommendations
#                 predicted_items = self.user_cf.recommend_by_user_based(
#                     user_id, user_item_matrix_df, csr_matrix, top_k=k
#                 )
                
#                 # Calculate metrics
#                 precision, recall = self.calculate_precision_recall_k(actual_items, predicted_items, k)
#                 map_score = self.calculate_map(actual_items, predicted_items)
                
#                 metrics['precisions'].append(precision)
#                 metrics['recalls'].append(recall)
#                 metrics['maps'].append(map_score)
            
#             # Calculate averages
#             avg_metrics = {
#                 f'precision@{k}': sum(metrics['precisions']) / len(metrics['precisions']) if metrics['precisions'] else 0,
#                 f'recall@{k}': sum(metrics['recalls']) / len(metrics['recalls']) if metrics['recalls'] else 0,
#                 'MAP': sum(metrics['maps']) / len(metrics['maps']) if metrics['maps'] else 0,
#                 'number_of_test_users': len(test_users),
#                 'number_of_evaluated_users': len(metrics['precisions'])
#             }
            
#             return avg_metrics
            
#         except Exception as e:
#             logging.error(f"Error during evaluation: {str(e)}")
#             raise Exception(f"Evaluation failed: {str(e)}")