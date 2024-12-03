class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.string :image
      t.string :title
      t.text :description
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
